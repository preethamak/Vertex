// End-to-end verification of the SIH lifecycle against the live database.
// Exercises the same REST calls the app makes (service-role RPCs + table ops).
// Usage: node scripts/e2e-sih.mjs  (reads .env)

import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("="))
    .map((line) => [
      line.slice(0, line.indexOf("=")).trim(),
      line
        .slice(line.indexOf("=") + 1)
        .trim()
        .replace(/^"|"$/g, ""),
    ]),
);

const URL_ = env.SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function rpc(fn, args) {
  const res = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers,
    body: JSON.stringify(args),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

let pass = 0;
let fail = 0;
function check(label, condition, detail = "") {
  if (condition) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.log(`  ✗ ${label} ${detail}`);
  }
}

const suffix = Date.now().toString(36);
const teamName = `E2E Squad ${suffix}`;

console.log("— SIH lifecycle verification —");

// 0. resolve event
const eventRes = await fetch(`${URL_}/rest/v1/events?slug=eq.sih-internal-hackathon&select=id`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});
const eventId = (await eventRes.json())[0]?.id;
check("event resolved", Boolean(eventId));

// 1. create team (lead only)
const created = await rpc("create_sih_team", {
  p_event_id: eventId,
  p_name: teamName,
  p_lead_name: "E2E Lead",
  p_lead_email: `e2e-lead-${suffix}@test.dev`,
  p_lead_gender: "male",
  p_lead_phone: "9000000000",
  p_lead_srn: `E2ESRN1`,
  p_lead_branch: "CSE",
  p_lead_year: "3",
});
check("register team (atomic)", created.status === 200 && created.body?.team_id);
const teamId = created.body.team_id;
const joinCode = created.body.join_code;
const managementToken = created.body.management_token;
const checkinToken = created.body.checkin_token;

// duplicate name rejected
const dup = await rpc("create_sih_team", {
  p_event_id: eventId,
  p_name: teamName,
  p_lead_name: "X",
  p_lead_email: "x@x.dev",
  p_lead_gender: "male",
  p_lead_phone: "",
  p_lead_srn: "",
  p_lead_branch: "",
  p_lead_year: "",
});
check("duplicate team name rejected", dup.status === 400);

// 2. join ×5 (one female) — 6 total
const genders = ["female", "male", "male", "male", "male"];
let lastJoin = null;
for (let i = 2; i <= 6; i++) {
  lastJoin = await rpc("join_sih_team", {
    p_event_id: eventId,
    p_join_code: joinCode,
    p_member: {
      name: `E2E Mate ${i}`,
      email: `e2e-mate-${i}-${suffix}@test.dev`,
      gender: genders[i - 2],
      phone: "",
      srn: `E2ESRN${i}`,
      branch: "CSE",
      year: "2",
    },
  });
  if (i < 6) check(`join member ${i}`, lastJoin.status === 200);
}
check(
  "join member 6 with member token",
  lastJoin.status === 200 && Boolean(lastJoin.body?.member_token),
);

// 3. team full → 7th rejected
const seventh = await rpc("join_sih_team", {
  p_event_id: eventId,
  p_join_code: joinCode,
  p_member: { name: "Extra", email: `e2e-7-${suffix}@test.dev`, gender: "male", srn: "E2ESRN7" },
});
check("7th join rejected (full)", seventh.status === 400);

// 4. duplicate email rejected
const dupEmail = await rpc("join_sih_team", {
  p_event_id: eventId,
  p_join_code: joinCode,
  p_member: { name: "Dup", email: `e2e-mate-2-${suffix}@test.dev`, gender: "male", srn: "E2EDUP" },
});
check("duplicate email rejected", dupEmail.status === 400);

// 5. bad code rejected
const badCode = await rpc("join_sih_team", {
  p_event_id: eventId,
  p_join_code: "ZZZZZZZZ",
  p_member: { name: "Bad", email: `e2e-bad-${suffix}@test.dev`, gender: "male", srn: "E2EBAD" },
});
check("bad join code rejected", badCode.status === 400);

// 6. teammate self-update + leave
const memberToken = lastJoin.body.member_token;
const selfUpdate = await rpc("update_sih_member_own", {
  p_member_token: memberToken,
  p_member: { name: "E2E Mate 6 Renamed", branch: "ECE" },
});
check("teammate self-edit", selfUpdate.status === 200 || selfUpdate.status === 204);

const leave = await rpc("leave_sih_team", { p_member_token: memberToken });
check("teammate leave", leave.status === 200 || leave.status === 204);
const rejoin = await rpc("join_sih_team", {
  p_event_id: eventId,
  p_join_code: joinCode,
  p_member: {
    name: "E2E Mate 6",
    email: `e2e-mate-6-${suffix}@test.dev`,
    gender: "male",
    srn: "E2ESRN6",
    branch: "ECE",
    year: "2",
  },
});
check("rejoin after leave", rejoin.status === 200);

// 7. rotate join code → old dead
const rotate = await rpc("rotate_sih_join_code", { p_management_token: managementToken });
check("rotate join code", rotate.status === 200 && rotate.body !== joinCode);
const oldCode = await rpc("join_sih_team", {
  p_event_id: eventId,
  p_join_code: joinCode,
  p_member: { name: "Old", email: `e2e-old-${suffix}@test.dev`, gender: "male", srn: "E2EOLD" },
});
check("old code dead after rotation", oldCode.status === 400);

// 8. reissue management token
const reissue = await rpc("reissue_sih_management_token", { p_team_id: teamId });
check("reissue team key", reissue.status === 200 && reissue.body !== managementToken);

// 9. mentor + showcase + reopen
check(
  "assign mentor",
  [200, 204].includes(
    (
      await rpc("assign_sih_mentor", {
        p_team_id: teamId,
        p_mentor_name: "Dr Judge",
        p_mentor_email: "judge@vertex.dev",
      })
    ).status,
  ),
);
check(
  "showcase toggle",
  [200, 204].includes(
    (await rpc("set_sih_showcase", { p_team_id: teamId, p_published: true })).status,
  ),
);
check(
  "reopen submission",
  [200, 204].includes((await rpc("reopen_sih_submission", { p_team_id: teamId })).status),
);

// 10. judging: score all criteria, over-max rejected
const critRes = await fetch(
  `${URL_}/rest/v1/evaluation_criteria?event_id=eq.${eventId}&select=id,max_score&order=sort_order`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
);
const criteria = await critRes.json();
check("criteria seeded", criteria.length === 5);
let judgeOk = true;
for (const criterion of criteria) {
  const r = await rpc("upsert_evaluation_score", {
    p_team_id: teamId,
    p_criterion_id: criterion.id,
    p_judge_id: "00000000-0000-0000-0000-000000000001",
    p_score: criterion.max_score * 0.8,
    p_feedback: "E2E",
  });
  if (r.status !== 200 && r.status !== 204) judgeOk = false;
}
check("score all 5 criteria", judgeOk);
const overMax = await rpc("upsert_evaluation_score", {
  p_team_id: teamId,
  p_criterion_id: criteria[0].id,
  p_judge_id: "00000000-0000-0000-0000-000000000001",
  p_score: 999,
  p_feedback: "",
});
check("over-max score rejected", overMax.status === 400);

// 11. check-in idempotency (direct table path mirrors the server fn)
const checkinRes = await fetch(`${URL_}/rest/v1/hackathon_checkins`, {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=representation" },
  body: JSON.stringify({ event_id: eventId, team_id: teamId, method: "qr" }),
});
check("check-in recorded", checkinRes.status === 201);
const checkinRes2 = await fetch(`${URL_}/rest/v1/hackathon_checkins`, {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=representation" },
  body: JSON.stringify({ event_id: eventId, team_id: teamId, method: "qr" }),
});
// The app path (supabase-js insert) receives the 23505 unique violation and
// maps it to an "already checked in" result — the constraint is the guarantee.
const duplicateBody = await checkinRes2.json();
check(
  "duplicate check-in blocked by constraint",
  checkinRes2.status === 409 && duplicateBody?.code === "23505",
);

// 12. cleanup
await fetch(`${URL_}/rest/v1/evaluation_scores?team_id=eq.${teamId}`, {
  method: "DELETE",
  headers,
});
await fetch(`${URL_}/rest/v1/hackathon_checkins?team_id=eq.${teamId}`, {
  method: "DELETE",
  headers,
});
await fetch(`${URL_}/rest/v1/hackathon_teams?id=eq.${teamId}`, { method: "DELETE", headers });
console.log("  (test data cleaned up)");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
