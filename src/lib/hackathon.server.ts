import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  HackathonJoinInput,
  HackathonRegisterInput,
  HackathonSubmissionInput,
  HackathonTeamUpdateInput,
} from "@/lib/schemas";

export const EVENT_SLUG = "sih-internal-hackathon";
export const OFFICIAL_SIH_TEAM_SIZE = 6;

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// A roster may grow gradually through invites; SIH eligibility is enforced when
// the team finalizes (and by join_sih_team when the sixth member joins).
function validateRosterShape(people: { name: string; email: string; srn: string }[]) {
  if (people.length < 1 || people.length > OFFICIAL_SIH_TEAM_SIZE) {
    throw new Error(
      `A team can have at most ${OFFICIAL_SIH_TEAM_SIZE} student members, including the lead.`,
    );
  }
  const emails = people.map((member) => member.email.toLowerCase());
  if (new Set(emails).size !== emails.length) {
    throw new Error("Each team member must use a different email address.");
  }
  const srns = people.map((member) => member.srn.trim().toLowerCase()).filter(Boolean);
  if (new Set(srns).size !== srns.length) {
    throw new Error("An SRN can only appear once in a team.");
  }
}

export async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(`vertex:${token}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function resolveEvent() {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("id, title")
    .eq("slug", EVENT_SLUG)
    .maybeSingle();
  if (error || !data) throw new Error("The hackathon workspace is not available.");
  return { eventId: data.id, title: data.title };
}

async function loadWorkspace(eventId: string) {
  const { data } = await supabaseAdmin
    .from("event_workspaces")
    .select("registration_open, submissions_open, min_team_size, max_team_size, rules")
    .eq("event_id", eventId)
    .maybeSingle();
  return data;
}

export async function getPublicRoster(eventId: string) {
  const { data: teams } = await supabaseAdmin
    .from("hackathon_teams")
    .select("id, name, status, created_at")
    .eq("event_id", eventId)
    .neq("status", "withdrawn")
    .order("created_at");
  const ids = (teams ?? []).map((t) => t.id);
  const { data: members } = ids.length
    ? await supabaseAdmin
        .from("hackathon_team_members")
        .select("team_id, name, branch, year, is_lead")
        .in("team_id", ids)
    : {
        data: [] as {
          team_id: string;
          name: string;
          branch: string | null;
          year: string | null;
          is_lead: boolean;
        }[],
      };

  return (teams ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    members: (members ?? [])
      .filter((m) => m.team_id === t.id)
      .map((m) => ({ name: m.name, branch: m.branch, year: m.year, isLead: m.is_lead })),
  }));
}

export async function checkInHackathonTeam(code: string, checkedInBy: string) {
  const token =
    code
      .trim()
      .split("/")
      .pop()
      ?.replace(/^VTX-SIH:/i, "") ?? "";
  if (!token) return { status: "invalid" as const };

  const { eventId } = await resolveEvent();
  const { data: team } = await supabaseAdmin
    .from("hackathon_teams")
    .select("id, name")
    .eq("event_id", eventId)
    .eq("checkin_token_hash", await hashToken(`checkin:${token}`))
    .maybeSingle();
  if (!team) return { status: "invalid" as const };

  const { data: existing } = await supabaseAdmin
    .from("hackathon_checkins")
    .select("checked_in_at")
    .eq("event_id", eventId)
    .eq("team_id", team.id)
    .maybeSingle();
  const { data: members } = await supabaseAdmin
    .from("hackathon_team_members")
    .select("name, is_lead")
    .eq("team_id", team.id)
    .order("is_lead", { ascending: false });

  if (existing) {
    return {
      status: "already" as const,
      team: team.name,
      members: members ?? [],
      at: existing.checked_in_at,
    };
  }

  const checkedInAt = new Date().toISOString();
  const { error } = await supabaseAdmin.from("hackathon_checkins").insert({
    event_id: eventId,
    team_id: team.id,
    checked_in_by: checkedInBy,
    checked_in_at: checkedInAt,
    method: "qr",
  });
  // Concurrent scans race here; the UNIQUE(event_id, team_id) constraint makes
  // the loser an idempotent "already checked in" instead of an error.
  if (error) {
    if (error.code === "23505") {
      return {
        status: "already" as const,
        team: team.name,
        members: members ?? [],
        at: checkedInAt,
      };
    }
    throw new Error("Could not record SIH check-in.");
  }
  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "checked_in",
    summary: "Team checked in at the SIH desk.",
  });
  return { status: "ok" as const, team: team.name, members: members ?? [], at: checkedInAt };
}

export async function createTeam(data: HackathonRegisterInput) {
  const { eventId } = await resolveEvent();

  // Everything (team + lead + submission workspace + activity) happens in one
  // atomic database call so a burst of registrations can never leave half-rows.
  const { data: result, error } = await supabaseAdmin.rpc("create_sih_team", {
    p_event_id: eventId,
    p_name: data.name,
    p_lead_name: data.leadName,
    p_lead_email: data.leadEmail,
    p_lead_gender: data.leadGender,
    p_lead_phone: data.leadPhone,
    p_lead_srn: data.leadSrn,
    p_lead_branch: data.leadBranch,
    p_lead_year: data.leadYear,
  });
  if (error || !result) {
    const message = typeof error?.message === "string" ? error.message : "";
    if (message.includes("already registered")) {
      throw new Error("A team with that name is already registered.");
    }
    if (message.includes("Registration is closed")) {
      throw new Error("Registration is closed right now.");
    }
    throw new Error("Could not register your team. Please try again.");
  }

  const payload = result as Record<string, unknown>;
  return {
    token: payload.management_token as string,
    teamId: payload.team_id as string,
    teamName: data.name,
    joinCode: payload.join_code as string,
    checkinCode: `VTX-SIH:${payload.checkin_token as string}`,
  };
}

export async function joinTeam(data: HackathonJoinInput) {
  const { eventId } = await resolveEvent();
  const { data: result, error } = await supabaseAdmin.rpc("join_sih_team", {
    p_event_id: eventId,
    p_join_code: data.code,
    p_member: {
      name: data.name,
      email: data.email,
      gender: data.gender,
      phone: data.phone,
      srn: data.srn,
      branch: data.branch,
      year: data.year,
    },
  });
  if (error || !result) {
    const raw = typeof error?.message === "string" ? error.message : "";
    const known = [
      "Registration is closed right now.",
      "That join code does not match any team.",
      "This team already submitted and its roster is locked.",
      "This team already has all 6 members.",
      "That email is already on this team.",
      "That SRN is already on this team.",
      "SIH 2026 requires each team to include at least one female student. This roster needs one before it can be completed.",
    ];
    throw new Error(known.includes(raw) ? raw : "Could not join the team. Please try again.");
  }
  const joined = result as Record<string, unknown>;
  return {
    teamName: joined.team_name as string,
    memberCount: joined.member_count as number,
    memberToken: joined.member_token as string,
  };
}

export async function rotateJoinCode(token: string) {
  const { data: result, error } = await supabaseAdmin.rpc("rotate_sih_join_code", {
    p_management_token: token,
  });
  if (error || !result) throw new Error("Could not generate a new invite code.");
  return { joinCode: result as string };
}

async function teamFromToken(token: string) {
  const hash = await hashToken(token);
  const { data } = await supabaseAdmin
    .from("hackathon_teams")
    .select("*")
    .eq("management_token_hash", hash)
    .maybeSingle();
  if (!data) throw new Error("That team key is not valid.");
  return data;
}

export async function loadTeamByToken(token: string) {
  const team = await teamFromToken(token);
  const [members, submission, activities, ws, statements] = await Promise.all([
    supabaseAdmin
      .from("hackathon_team_members")
      .select("id, name, email, gender, phone, usn, branch, year, is_lead")
      .eq("team_id", team.id)
      .order("is_lead", { ascending: false })
      .order("created_at"),
    supabaseAdmin.from("hackathon_submissions").select("*").eq("team_id", team.id).maybeSingle(),
    supabaseAdmin
      .from("hackathon_activities")
      .select("id, activity_type, summary, created_at")
      .eq("team_id", team.id)
      .order("created_at", { ascending: false })
      .limit(30),
    loadWorkspace(team.event_id),
    supabaseAdmin
      .from("hackathon_problem_statements")
      .select("id, statement_code, title, theme")
      .eq("event_id", team.event_id)
      .eq("published", true)
      .order("sort_order"),
  ]);

  return {
    team: {
      id: team.id,
      name: team.name,
      status: team.status,
      leadName: team.lead_name,
      leadEmail: team.lead_email,
      leadPhone: team.lead_phone,
      mentorName: team.mentor_name,
      mentorEmail: team.mentor_email,
      joinCode: team.join_code,
    },
    members: (members.data ?? []).map((member) => ({ ...member, srn: member.usn })),
    submission: submission.data ?? null,
    activities: activities.data ?? [],
    workspace: ws,
    problemStatements: statements.data ?? [],
  };
}

export async function updateTeam(data: HackathonTeamUpdateInput) {
  const team = await teamFromToken(data.token);
  const people = data.members.filter((m) => m.name.trim() && m.email.trim());
  validateRosterShape(people);
  if (people.filter((m) => m.isLead).length !== 1) {
    throw new Error("Mark exactly one person as the team lead.");
  }

  const { data: submission } = await supabaseAdmin
    .from("hackathon_submissions")
    .select("finalized_at")
    .eq("team_id", team.id)
    .maybeSingle();
  if (submission?.finalized_at) {
    throw new Error(
      "This team is locked after final submission. Ask an administrator to reopen it.",
    );
  }

  const lead = people.find((member) => member.isLead)!;
  const { error: rosterError } = await supabaseAdmin.rpc("update_sih_team_and_roster", {
    p_team_id: team.id,
    p_name: data.name.trim(),
    p_mentor_name: data.mentorName.trim(),
    p_mentor_email: data.mentorEmail.trim(),
    p_lead_name: lead.name.trim(),
    p_lead_email: lead.email.trim(),
    p_members: people.map((member) => ({
      name: member.name.trim(),
      email: member.email.trim(),
      gender: member.gender,
      phone: member.phone.trim(),
      srn: member.srn.trim(),
      branch: member.branch.trim(),
      year: member.year.trim(),
      is_lead: member.isLead,
    })),
  });
  if (rosterError) throw new Error("Could not save the team roster. No changes were made.");

  const { error: activityError } = await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "team_updated",
    summary: `Roster updated — ${people.length} members.`,
  });
  if (activityError) console.error("SIH team update activity was not recorded", activityError);
  return { ok: true };
}

export async function storeSubmissionDeck(data: {
  token: string;
  contentType: "application/pdf";
  base64: string;
}) {
  const team = await teamFromToken(data.token);
  const binary = Uint8Array.from(atob(data.base64), (char) => char.charCodeAt(0));
  if (binary.byteLength > 8 * 1024 * 1024) throw new Error("Keep the presentation PDF under 8 MB.");
  const signature = new TextDecoder().decode(binary.slice(0, 5));
  if (signature !== "%PDF-") throw new Error("Upload an actual PDF presentation.");
  const path = `sih-submissions/${team.id}/${crypto.randomUUID()}.pdf`;
  const { error } = await supabaseAdmin.storage.from("media").upload(path, binary, {
    contentType: data.contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("Could not store the presentation PDF.");
  return { path, url: `/api/public/media/${path}` };
}

export async function saveSubmission(data: HackathonSubmissionInput) {
  const team = await teamFromToken(data.token);
  const ws = await loadWorkspace(team.event_id);
  if (!ws?.submissions_open) throw new Error("Submissions are not open yet.");

  const { data: existing } = await supabaseAdmin
    .from("hackathon_submissions")
    .select("id, finalized_at")
    .eq("team_id", team.id)
    .maybeSingle();
  if (existing?.finalized_at) {
    throw new Error("This submission is already final. Ask an administrator to reopen it.");
  }
  if (
    data.submit &&
    (!data.problemStatementId ||
      !data.problemStatementTitle ||
      !data.solutionTitle ||
      !data.solutionSummary)
  ) {
    throw new Error(
      "Select a problem statement and complete the solution title and summary before final submission.",
    );
  }

  // Final submission locks the roster, so SIH eligibility is enforced here.
  if (data.submit) {
    const { data: roster } = await supabaseAdmin
      .from("hackathon_team_members")
      .select("gender")
      .eq("team_id", team.id);
    const members = roster ?? [];
    if (members.length !== OFFICIAL_SIH_TEAM_SIZE) {
      throw new Error(
        `Your roster is incomplete: ${members.length}/6 members. All invites must be accepted before final submission.`,
      );
    }
    if (!members.some((member) => member.gender === "female")) {
      throw new Error(
        "SIH 2026 requires each team to include at least one female student before final submission.",
      );
    }
  }

  let statement: { id: string; title: string; theme: string | null } | null = null;
  if (data.problemStatementId) {
    const { data: found, error: statementError } = await supabaseAdmin
      .from("hackathon_problem_statements")
      .select("id, title, theme")
      .eq("id", data.problemStatementId)
      .eq("event_id", team.event_id)
      .eq("published", true)
      .maybeSingle();
    if (statementError || !found)
      throw new Error("Choose a current published SIH problem statement.");
    statement = found;
  }

  const row = {
    team_id: team.id,
    problem_statement_id: statement?.id ?? null,
    problem_statement_title: statement?.title ?? null,
    theme: statement?.theme ?? null,
    solution_title: data.solutionTitle || null,
    solution_summary: data.solutionSummary || null,
    repository_url: data.repositoryUrl || null,
    demo_url: data.demoUrl || null,
    video_url: data.videoUrl || null,
    deck_path: data.deckPath || null,
    status: data.submit ? "final" : "draft",
    submitted_at: data.submit ? new Date().toISOString() : null,
    finalized_at: data.submit ? new Date().toISOString() : null,
    finalized_by_token_hash: data.submit ? await hashToken(data.token) : null,
  };

  const { error } = existing
    ? await supabaseAdmin.from("hackathon_submissions").update(row).eq("id", existing.id)
    : await supabaseAdmin.from("hackathon_submissions").insert(row);
  if (error) throw new Error("Could not save your submission.");

  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: data.submit ? "submitted" : "submission_saved",
    summary: data.submit ? "Final submission locked in." : "Submission draft saved.",
  });
  return { ok: true, status: row.status };
}

export async function adminOverviewData() {
  const { eventId } = await resolveEvent();
  const [teams, members, submissions, milestones, announcements, statements, checkins, ws] =
    await Promise.all([
      supabaseAdmin
        .from("hackathon_teams")
        .select(
          "id, name, status, lead_name, lead_email, lead_phone, mentor_name, mentor_email, created_at",
        )
        .eq("event_id", eventId)
        .order("created_at"),
      supabaseAdmin
        .from("hackathon_team_members")
        .select("id, team_id, name, email, phone, usn, branch, year, is_lead"),
      supabaseAdmin
        .from("hackathon_submissions")
        .select(
          "team_id, solution_title, status, repository_url, demo_url, video_url, deck_path, published, submitted_at, finalized_at",
        ),
      supabaseAdmin
        .from("event_milestones")
        .select("id, title, description, starts_at, ends_at, sort_order, published")
        .eq("event_id", eventId)
        .order("sort_order"),
      supabaseAdmin
        .from("event_announcements")
        .select("id, title, body, pinned, published, created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("hackathon_problem_statements")
        .select(
          "id, statement_code, title, organization, category, theme, description, source_url, source_version, published, sort_order",
        )
        .eq("event_id", eventId)
        .order("sort_order"),
      supabaseAdmin
        .from("hackathon_checkins")
        .select("team_id, checked_in_at")
        .eq("event_id", eventId),
      loadWorkspace(eventId),
    ]);

  return {
    teams: teams.data ?? [],
    members: members.data ?? [],
    submissions: submissions.data ?? [],
    milestones: milestones.data ?? [],
    announcements: announcements.data ?? [],
    statements: statements.data ?? [],
    checkins: checkins.data ?? [],
    workspace: ws,
  };
}

/* ============================================================
   Teammate self-service
   ============================================================ */

async function memberFromToken(token: string) {
  const { data } = await supabaseAdmin
    .from("hackathon_team_members")
    .select("id, team_id, name, email, gender, phone, usn, branch, year, is_lead")
    .eq("member_token_hash", await hashToken(`member:${token}`))
    .maybeSingle();
  if (!data) throw new Error("That member key is not valid.");
  return data;
}

export async function loadTeamByMemberToken(token: string) {
  const member = await memberFromToken(token);
  const { data: teamRow } = await supabaseAdmin
    .from("hackathon_teams")
    .select("id, event_id, name, status, lead_name, join_code")
    .eq("id", member.team_id)
    .maybeSingle();
  if (!teamRow) throw new Error("Team not found.");
  const [members, submission, ws] = await Promise.all([
    supabaseAdmin
      .from("hackathon_team_members")
      .select("id, name, branch, year, is_lead")
      .eq("team_id", member.team_id)
      .order("is_lead", { ascending: false })
      .order("created_at"),
    supabaseAdmin
      .from("hackathon_submissions")
      .select("status, solution_title, finalized_at")
      .eq("team_id", member.team_id)
      .maybeSingle(),
    loadWorkspace(teamRow.event_id),
  ]);
  return {
    me: {
      id: member.id,
      name: member.name,
      email: member.email,
      gender: member.gender,
      phone: member.phone,
      srn: member.usn,
      branch: member.branch,
      year: member.year,
    },
    team: teamRow,
    members: members.data ?? [],
    submission: submission.data ?? null,
    workspace: ws,
  };
}

export async function updateOwnMemberEntry(token: string, member: Record<string, string>) {
  const { error } = await supabaseAdmin.rpc("update_sih_member_own", {
    p_member_token: token,
    p_member: member,
  });
  if (error) {
    const raw = error.message;
    throw new Error(
      raw.includes("SRN is already")
        ? "That SRN is already used by a teammate."
        : raw.includes("locked")
          ? "This team already submitted and its roster is locked."
          : "Could not update your details.",
    );
  }
  return { ok: true };
}

export async function leaveTeam(token: string) {
  const { error } = await supabaseAdmin.rpc("leave_sih_team", { p_member_token: token });
  if (error) {
    const raw = error.message;
    throw new Error(
      raw.includes("lead")
        ? "The team lead cannot leave. Ask an administrator instead."
        : raw.includes("locked")
          ? "This team already submitted and its roster is locked."
          : "Could not leave the team.",
    );
  }
  return { ok: true };
}

/* ============================================================
   Staff: key recovery, review workflow, mentors
   ============================================================ */

export async function reissueTeamKey(teamId: string) {
  const { data, error } = await supabaseAdmin.rpc("reissue_sih_management_token", {
    p_team_id: teamId,
  });
  if (error || !data) throw new Error("Could not reissue the team key.");
  return { token: data as string };
}

export async function reopenSubmission(teamId: string) {
  const { error } = await supabaseAdmin.rpc("reopen_sih_submission", { p_team_id: teamId });
  if (error) throw new Error("Could not reopen the submission.");
  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: teamId,
    activity_type: "submission_reopened",
    summary: "Submission reopened for edits by the SIH desk.",
  });
  return { ok: true };
}

export async function setShowcase(teamId: string, published: boolean) {
  const { error } = await supabaseAdmin.rpc("set_sih_showcase", {
    p_team_id: teamId,
    p_published: published,
  });
  if (error) throw new Error("Could not update the showcase flag.");
  return { ok: true };
}

export async function assignMentor(teamId: string, mentorName: string, mentorEmail: string) {
  const { error } = await supabaseAdmin.rpc("assign_sih_mentor", {
    p_team_id: teamId,
    p_mentor_name: mentorName,
    p_mentor_email: mentorEmail,
  });
  if (error) throw new Error("Could not assign the mentor.");
  return { ok: true };
}

/* ============================================================
   Judging
   ============================================================ */

export async function getJudgingData() {
  const { eventId } = await resolveEvent();
  const [criteria, teams, scores] = await Promise.all([
    supabaseAdmin
      .from("evaluation_criteria")
      .select("id, name, description, max_score, weight, sort_order")
      .eq("event_id", eventId)
      .order("sort_order"),
    supabaseAdmin
      .from("hackathon_teams")
      .select("id, name, status, checked_in(hackathon_checkins)")
      .eq("event_id", eventId)
      .neq("status", "withdrawn")
      .order("name"),
    supabaseAdmin
      .from("evaluation_scores")
      .select("team_id, criterion_id, judge_id, score, feedback"),
  ]);

  const teamIds = new Set((teams.data ?? []).map((t) => t.id));
  const validScores = (scores.data ?? []).filter((s) => teamIds.has(s.team_id));

  // Weighted leaderboard: total weight-normalised score per team, judges averaged.
  const perTeam = new Map<
    string,
    { weighted: number; weightSum: number; judges: Set<string>; feedback: string[] }
  >();
  const criteriaById = new Map((criteria.data ?? []).map((c) => [c.id, c]));
  for (const score of validScores) {
    const criterion = criteriaById.get(score.criterion_id);
    if (!criterion) continue;
    const entry = perTeam.get(score.team_id) ?? {
      weighted: 0,
      weightSum: 0,
      judges: new Set(),
      feedback: [],
    };
    entry.weighted += Number(score.score) * Number(criterion.weight);
    entry.weightSum += Number(criterion.weight);
    entry.judges.add(score.judge_id);
    if (score.feedback) entry.feedback.push(score.feedback);
    perTeam.set(score.team_id, entry);
  }

  const leaderboard = (teams.data ?? [])
    .map((team) => {
      const entry = perTeam.get(team.id);
      const total = entry && entry.weightSum > 0 ? entry.weighted / entry.weightSum : null;
      return {
        teamId: team.id,
        name: team.name,
        status: team.status,
        judgeCount: entry?.judges.size ?? 0,
        scoreTotal: total === null ? null : Math.round(total * 100) / 100,
      };
    })
    .sort((a, b) => (b.scoreTotal ?? -1) - (a.scoreTotal ?? -1));

  return {
    criteria: criteria.data ?? [],
    teams: (teams.data ?? []).map((t) => ({ id: t.id, name: t.name, status: t.status })),
    scores: validScores,
    leaderboard,
  };
}

export async function saveJudgeScore(input: {
  teamId: string;
  criterionId: string;
  judgeId: string;
  score: number;
  feedback: string;
}) {
  const { error } = await supabaseAdmin.rpc("upsert_evaluation_score", {
    p_team_id: input.teamId,
    p_criterion_id: input.criterionId,
    p_judge_id: input.judgeId,
    p_score: input.score,
    p_feedback: input.feedback,
  });
  if (error) {
    const raw = error.message;
    throw new Error(
      raw.startsWith("Score must be")
        ? raw
        : "Could not save that score. Check the range and try again.",
    );
  }
  return { ok: true };
}
