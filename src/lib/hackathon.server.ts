import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  HackathonRegisterInput,
  HackathonSubmissionInput,
  HackathonTeamUpdateInput,
} from "@/lib/schemas";

export const EVENT_SLUG = "sih-internal-hackathon";

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
    : { data: [] as { team_id: string; name: string; branch: string | null; year: string | null; is_lead: boolean }[] };

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

export async function createTeam(data: HackathonRegisterInput) {
  const { eventId } = await resolveEvent();
  const ws = await loadWorkspace(eventId);
  if (!ws?.registration_open) throw new Error("Registration is closed right now.");

  const members = data.members.filter((m) => m.name.trim() && m.email.trim());
  const total = members.length + 1;
  if (total < ws.min_team_size || total > ws.max_team_size) {
    throw new Error(`Teams must have between ${ws.min_team_size} and ${ws.max_team_size} people (including the lead).`);
  }

  const token = crypto.randomUUID().replace(/-/g, "");
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
    })
    .select("id, name")
    .single();
  if (error || !team) {
    throw new Error(
      error?.code === "23505" ? "A team with that name is already registered." : "Could not register your team.",
    );
  }

  const rows = [
    {
      team_id: team.id,
      name: data.leadName,
      email: data.leadEmail.toLowerCase(),
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
      phone: m.phone || null,
      usn: m.usn || null,
      branch: m.branch || null,
      year: m.year || null,
      is_lead: false,
    })),
  ];
  await supabaseAdmin.from("hackathon_team_members").insert(rows);
  await supabaseAdmin.from("hackathon_submissions").insert({ team_id: team.id });
  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "registered",
    summary: `${team.name} registered with ${rows.length} members.`,
  });

  return { token, teamId: team.id, teamName: team.name };
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
  const [members, submission, activities, ws] = await Promise.all([
    supabaseAdmin
      .from("hackathon_team_members")
      .select("id, name, email, phone, usn, branch, year, is_lead")
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
  };
}

export async function updateTeam(data: HackathonTeamUpdateInput) {
  const team = await teamFromToken(data.token);
  const ws = await loadWorkspace(team.event_id);
  const people = data.members.filter((m) => m.name.trim() && m.email.trim());
  if (ws && (people.length < ws.min_team_size || people.length > ws.max_team_size)) {
    throw new Error(`Teams must have between ${ws.min_team_size} and ${ws.max_team_size} people.`);
  }
  if (!people.some((m) => m.isLead)) throw new Error("Mark one person as the team lead.");

  await supabaseAdmin
    .from("hackathon_teams")
    .update({
      name: data.name,
      college: data.college || null,
      mentor_name: data.mentorName || null,
      mentor_email: data.mentorEmail || null,
      lead_name: people.find((m) => m.isLead)?.name ?? team.lead_name,
      lead_email: (people.find((m) => m.isLead)?.email ?? team.lead_email).toLowerCase(),
    })
    .eq("id", team.id);

  await supabaseAdmin.from("hackathon_team_members").delete().eq("team_id", team.id);
  await supabaseAdmin.from("hackathon_team_members").insert(
    people.map((m) => ({
      team_id: team.id,
      name: m.name,
      email: m.email.toLowerCase(),
      phone: m.phone || null,
      usn: m.usn || null,
      branch: m.branch || null,
      year: m.year || null,
      is_lead: m.isLead,
    })),
  );
  await supabaseAdmin.from("hackathon_activities").insert({
    team_id: team.id,
    activity_type: "team_updated",
    summary: `Roster updated — ${people.length} members.`,
  });
  return { ok: true };
}

export async function saveSubmission(data: HackathonSubmissionInput) {
  const team = await teamFromToken(data.token);
  const ws = await loadWorkspace(team.event_id);
  if (!ws?.submissions_open) throw new Error("Submissions are not open yet.");

  const row = {
    team_id: team.id,
    problem_statement_id: data.problemStatementId || null,
    problem_statement_title: data.problemStatementTitle || null,
    theme: data.theme || null,
    solution_title: data.solutionTitle || null,
    solution_summary: data.solutionSummary || null,
    repository_url: data.repositoryUrl || null,
    demo_url: data.demoUrl || null,
    video_url: data.videoUrl || null,
    deck_path: data.deckPath || null,
    status: data.submit ? "submitted" : "draft",
    submitted_at: data.submit ? new Date().toISOString() : null,
  };

  const { data: existing } = await supabaseAdmin
    .from("hackathon_submissions")
    .select("id")
    .eq("team_id", team.id)
    .maybeSingle();

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
  const [teams, members, submissions, milestones, announcements, ws] = await Promise.all([
    supabaseAdmin
      .from("hackathon_teams")
      .select("id, name, status, college, lead_name, lead_email, lead_phone, mentor_name, created_at")
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
    loadWorkspace(eventId),
  ]);

  return {
    teams: teams.data ?? [],
    members: members.data ?? [],
    submissions: submissions.data ?? [],
    milestones: milestones.data ?? [],
    announcements: announcements.data ?? [],
    workspace: ws,
  };
}
