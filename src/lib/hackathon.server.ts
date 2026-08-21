import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  HackathonRegisterInput,
  HackathonSubmissionInput,
  HackathonTeamUpdateInput,
} from "@/lib/schemas";

export const EVENT_SLUG = "sih-internal-hackathon";
export const OFFICIAL_SIH_TEAM_SIZE = 6;

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function validateTeamEligibility(input: {
  name: string;
  college: string;
  people: { gender: "female" | "male" | "prefer_not_to_say" }[];
}) {
  if (!input.people.some((person) => person.gender === "female")) {
    throw new Error("SIH 2026 requires each team to include at least one female student.");
  }
  const college = normalized(input.college);
  if (college.length >= 5 && normalized(input.name).includes(college)) {
    throw new Error("SIH 2026 team names cannot include the institute name.");
  }
}

function validateTeamSize(total: number) {
  if (total !== OFFICIAL_SIH_TEAM_SIZE) {
    throw new Error(
      `SIH 2026 teams must have exactly ${OFFICIAL_SIH_TEAM_SIZE} student members, including the team lead.`,
    );
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
    .select("registration_open, submissions_open, min_team_size, max_team_size")
    .eq("event_id", eventId)
    .maybeSingle();
  return data;
}

export async function getPublicRoster(eventId: string) {
  const { data: teams } = await supabaseAdmin
    .from("hackathon_teams")
    .select("id, name, college, status, created_at")
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
    college: t.college,
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
  if (error) throw new Error("Could not record SIH check-in.");
  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "checked_in",
    summary: "Team checked in at the SIH desk.",
  });
  return { status: "ok" as const, team: team.name, members: members ?? [], at: checkedInAt };
}

export async function createTeam(data: HackathonRegisterInput) {
  const { eventId } = await resolveEvent();
  const ws = await loadWorkspace(eventId);
  if (!ws?.registration_open) throw new Error("Registration is closed right now.");

  const members = data.members.filter((m) => m.name.trim() && m.email.trim());
  const total = members.length + 1;
  validateTeamSize(total);
  validateTeamEligibility({
    name: data.name,
    college: data.college,
    people: [{ gender: data.leadGender }, ...members],
  });

  const identities = [data.leadEmail, ...members.map((member) => member.email)].map((email) =>
    email.trim().toLowerCase(),
  );
  if (new Set(identities).size !== identities.length) {
    throw new Error("Each team member must use a different email address.");
  }
  const usns = [data.leadUsn, ...members.map((member) => member.usn)]
    .map((usn) => usn.trim().toLowerCase())
    .filter(Boolean);
  if (new Set(usns).size !== usns.length) {
    throw new Error("A USN can only appear once in a team.");
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  const checkinToken = crypto.randomUUID().replace(/-/g, "");
  const { data: team, error } = await supabaseAdmin
    .from("hackathon_teams")
    .insert({
      event_id: eventId,
      name: data.name,
      lead_name: data.leadName,
      lead_email: data.leadEmail.toLowerCase(),
      lead_phone: data.leadPhone || null,
      college: data.college || null,
      management_token_hash: await hashToken(token),
      checkin_token_hash: await hashToken(`checkin:${checkinToken}`),
    })
    .select("id, name")
    .single();
  if (error || !team) {
    throw new Error(
      error?.code === "23505"
        ? "A team with that name is already registered."
        : "Could not register your team.",
    );
  }

  const rows = [
    {
      team_id: team.id,
      name: data.leadName,
      email: data.leadEmail.toLowerCase(),
      gender: data.leadGender,
      phone: data.leadPhone || null,
      usn: data.leadUsn || null,
      branch: data.leadBranch || null,
      year: data.leadYear || null,
      is_lead: true,
    },
    ...members.map((m) => ({
      team_id: team.id,
      name: m.name,
      email: m.email.toLowerCase(),
      gender: m.gender,
      phone: m.phone || null,
      usn: m.usn || null,
      branch: m.branch || null,
      year: m.year || null,
      is_lead: false,
    })),
  ];
  const { error: membersError } = await supabaseAdmin.from("hackathon_team_members").insert(rows);
  if (membersError) {
    await supabaseAdmin.from("hackathon_teams").delete().eq("id", team.id);
    throw new Error("Could not save the team roster. Please try registering again.");
  }
  const { error: submissionError } = await supabaseAdmin
    .from("hackathon_submissions")
    .insert({ team_id: team.id });
  if (submissionError) {
    await supabaseAdmin.from("hackathon_teams").delete().eq("id", team.id);
    throw new Error("Could not prepare the submission workspace. Please try registering again.");
  }
  const { error: activityError } = await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "registered",
    summary: `${team.name} registered with ${rows.length} members.`,
  });
  if (activityError) console.error("SIH registration activity was not recorded", activityError);

  return {
    token,
    teamId: team.id,
    teamName: team.name,
    checkinCode: `VTX-SIH:${checkinToken}`,
  };
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
      college: team.college,
      leadName: team.lead_name,
      leadEmail: team.lead_email,
      leadPhone: team.lead_phone,
      mentorName: team.mentor_name,
      mentorEmail: team.mentor_email,
    },
    members: members.data ?? [],
    submission: submission.data ?? null,
    activities: activities.data ?? [],
    workspace: ws,
    problemStatements: statements.data ?? [],
  };
}

export async function updateTeam(data: HackathonTeamUpdateInput) {
  const team = await teamFromToken(data.token);
  const people = data.members.filter((m) => m.name.trim() && m.email.trim());
  validateTeamSize(people.length);
  if (!people.some((m) => m.isLead)) throw new Error("Mark one person as the team lead.");
  validateTeamEligibility({ name: data.name, college: data.college, people });
  const emails = people.map((member) => member.email.toLowerCase());
  if (new Set(emails).size !== emails.length)
    throw new Error("Each team member must use a different email address.");
  const usns = people.map((member) => member.usn.trim().toLowerCase()).filter(Boolean);
  if (new Set(usns).size !== usns.length) throw new Error("A USN can only appear once in a team.");

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
    p_college: data.college.trim(),
    p_mentor_name: data.mentorName.trim(),
    p_mentor_email: data.mentorEmail.trim(),
    p_lead_name: lead.name.trim(),
    p_lead_email: lead.email.trim(),
    p_members: people.map((member) => ({
      name: member.name.trim(),
      email: member.email.trim(),
      gender: member.gender,
      phone: member.phone.trim(),
      usn: member.usn.trim(),
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
          "id, name, status, college, lead_name, lead_email, lead_phone, mentor_name, created_at",
        )
        .eq("event_id", eventId)
        .order("created_at"),
      supabaseAdmin
        .from("hackathon_team_members")
        .select("id, team_id, name, email, phone, usn, branch, year, is_lead"),
      supabaseAdmin
        .from("hackathon_submissions")
        .select("team_id, solution_title, status, repository_url, demo_url, submitted_at"),
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
