import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, KeyRound, Save, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  getHackathonTeam,
  saveHackathonSubmission,
  uploadHackathonDeck,
  updateHackathonTeam,
} from "@/lib/hackathon.functions";

export const Route = createFileRoute("/events/sih-internal-hackathon/team")({
  component: TeamConsole,
});

type TeamData = Awaited<ReturnType<typeof getHackathonTeam>>;
type MemberDraft = {
  name: string;
  email: string;
  gender: "female" | "male" | "prefer_not_to_say";
  phone: string;
  srn: string;
  branch: string;
  year: string;
  isLead: boolean;
};

function TeamConsole() {
  const loadTeam = useServerFn(getHackathonTeam);
  const [token, setToken] = useState("");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setToken(sessionStorage.getItem("vertex-sih-team-key") ?? ""), []);

  const open = async () => {
    if (!token.trim()) return toast.error("Enter the private team key from registration.");
    setLoading(true);
    try {
      const data = await loadTeam({ data: { token: token.trim() } });
      sessionStorage.setItem("vertex-sih-team-key", token.trim());
      setTeamData(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Team key not recognised.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          to="/events/sih-internal-hackathon"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} /> SIH workspace
        </Link>
        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="glass-panel h-fit rounded-2xl p-6">
            <KeyRound className="text-silver" size={21} />
            <h1 className="mt-4 font-display text-3xl">Team console</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This key controls your roster and submission. It is different from the event-day QR.
            </p>
            <label className="mt-6 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Team key
              </span>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="field-input rounded-lg px-3 py-2.5 font-mono text-sm"
                autoComplete="off"
              />
            </label>
            <button
              onClick={open}
              disabled={loading}
              className="btn-primary mt-4 w-full justify-center rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Opening…" : "Open team workspace"}
            </button>
          </aside>
          <section>
            {teamData ? (
              <TeamWorkspace data={teamData} token={token.trim()} onRefresh={open} />
            ) : (
              <div className="surface-card rounded-2xl p-8">
                <Users className="text-silver" size={28} />
                <p className="mt-5 font-display text-2xl">Your workspace stays private.</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Open it with your team key to manage your six-person roster and submission.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeamWorkspace({
  data,
  token,
  onRefresh,
}: {
  data: TeamData;
  token: string;
  onRefresh: () => Promise<unknown>;
}) {
  return (
    <div className="space-y-6">
      <div className="surface-card rounded-2xl p-7">
        <span className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">
          {data.team.status}
        </span>
        <h2 className="mt-3 font-display text-4xl">{data.team.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground"></p>
      </div>
      <RosterEditor data={data} token={token} onSaved={onRefresh} />
      <SubmissionEditor data={data} token={token} onSaved={onRefresh} />
      <ActivityLog items={data.activities} />
    </div>
  );
}

function RosterEditor({
  data,
  token,
  onSaved,
}: {
  data: TeamData;
  token: string;
  onSaved: () => Promise<unknown>;
}) {
  const update = useServerFn(updateHackathonTeam);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(data.team.name);
  const [mentorName, setMentorName] = useState(data.team.mentorName ?? "");
  const [mentorEmail, setMentorEmail] = useState(data.team.mentorEmail ?? "");
  const [members, setMembers] = useState<MemberDraft[]>(() =>
    data.members.map((member) => ({
      name: member.name,
      email: member.email,
      gender:
        member.gender === "female" || member.gender === "male"
          ? member.gender
          : "prefer_not_to_say",
      phone: member.phone ?? "",
      srn: member.srn ?? "",
      branch: member.branch ?? "",
      year: member.year ?? "",
      isLead: member.is_lead,
    })),
  );

  const change = (index: number, key: keyof MemberDraft, value: string | boolean) => {
    setMembers((current) =>
      current.map((member, i) => (i === index ? { ...member, [key]: value } : member)),
    );
  };

  const save = async () => {
    if (members.length !== 6) return toast.error("SIH teams must have exactly six students.");
    setSaving(true);
    try {
      await update({ data: { token, name, mentorName, mentorEmail, members } });
      toast.success("Roster saved.");
      setEditing(false);
      await onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the roster.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">Roster</p>
          <h3 className="mt-2 font-display text-2xl">Six students, one team.</h3>
        </div>
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="btn-ghost rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-widest"
        >
          {editing ? "Close editor" : "Edit roster"}
        </button>
      </div>
      {!editing ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {data.members.map((member) => (
            <div key={member.id} className="rounded-xl border border-hairline bg-surface-2 p-4">
              <div className="font-display text-lg">{member.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {member.is_lead ? "Team lead" : "Member"}
                {member.srn ? ` · ${member.srn}` : ""}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Team name" value={name} onChange={setName} />
            <Field label="Mentor name (optional)" value={mentorName} onChange={setMentorName} />
            <Field
              label="Mentor email (optional)"
              value={mentorEmail}
              onChange={setMentorEmail}
              type="email"
            />
          </div>
          {members.map((member, index) => (
            <div key={index} className="rounded-xl border border-hairline p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver">
                  Member {index + 1}
                </span>
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <input
                    type="radio"
                    checked={member.isLead}
                    onChange={() =>
                      setMembers((current) =>
                        current.map((item, i) => ({ ...item, isLead: i === index })),
                      )
                    }
                  />{" "}
                  Team lead
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Name"
                  value={member.name}
                  onChange={(value) => change(index, "name", value)}
                />
                <Field
                  label="Email"
                  value={member.email}
                  type="email"
                  onChange={(value) => change(index, "email", value)}
                />
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Gender (SIH eligibility)
                  </span>
                  <select
                    value={member.gender}
                    onChange={(event) => change(index, "gender", event.target.value)}
                    className="field-input rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="prefer_not_to_say">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </label>
                <Field
                  label="SRN"
                  value={member.srn}
                  onChange={(value) => change(index, "srn", value)}
                />
                <Field
                  label="Branch"
                  value={member.branch}
                  onChange={(value) => change(index, "branch", value)}
                />
                <Field
                  label="Year"
                  value={member.year}
                  onChange={(value) => change(index, "year", value)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="btn-primary rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save roster"}
          </button>
        </div>
      )}
    </div>
  );
}

function SubmissionEditor({
  data,
  token,
  onSaved,
}: {
  data: TeamData;
  token: string;
  onSaved: () => Promise<unknown>;
}) {
  const save = useServerFn(saveHackathonSubmission);
  const uploadDeck = useServerFn(uploadHackathonDeck);
  const deckInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [statementId, setStatementId] = useState(data.submission?.problem_statement_id ?? "");
  const [title, setTitle] = useState(data.submission?.solution_title ?? "");
  const [summary, setSummary] = useState(data.submission?.solution_summary ?? "");
  const [repositoryUrl, setRepositoryUrl] = useState(data.submission?.repository_url ?? "");
  const [demoUrl, setDemoUrl] = useState(data.submission?.demo_url ?? "");
  const [deckPath, setDeckPath] = useState(data.submission?.deck_path ?? "");
  const [deckBusy, setDeckBusy] = useState(false);
  const finalized = Boolean(data.submission?.finalized_at);
  const selected = data.problemStatements.find((statement) => statement.id === statementId);

  const submit = async (final: boolean) => {
    if (!data.workspace?.submissions_open) return toast.error("Submissions are not open yet.");
    setSaving(true);
    try {
      await save({
        data: {
          token,
          problemStatementId: statementId,
          problemStatementTitle: selected?.title ?? "",
          theme: selected?.theme ?? "",
          solutionTitle: title,
          solutionSummary: summary,
          repositoryUrl,
          demoUrl,
          videoUrl: "",
          deckPath,
          submit: final,
        },
      });
      toast.success(final ? "Final submission locked." : "Draft saved.");
      await onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the submission.");
    } finally {
      setSaving(false);
    }
  };

  const chooseDeck = async (file: File) => {
    if (file.type !== "application/pdf") return toast.error("Upload the presentation as a PDF.");
    if (file.size > 8 * 1024 * 1024) return toast.error("Keep the presentation PDF under 8 MB.");
    setDeckBusy(true);
    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      let binary = "";
      for (let index = 0; index < buffer.length; index += 0x8000)
        binary += String.fromCharCode(...buffer.subarray(index, index + 0x8000));
      const result = await uploadDeck({
        data: { token, contentType: "application/pdf", base64: btoa(binary) },
      });
      setDeckPath(result.path);
      toast.success("Presentation PDF attached.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload the presentation.");
    } finally {
      setDeckBusy(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">Submission</p>
      <h3 className="mt-2 font-display text-2xl">
        {finalized ? "Final submission locked" : "Build your entry."}
      </h3>
      {!data.workspace?.submissions_open && (
        <p className="mt-3 text-sm text-muted-foreground">
          The SIH desk has not opened submissions yet. You can review your roster above.
        </p>
      )}
      {data.workspace?.submissions_open && !finalized && (
        <div className="mt-6 grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Official problem statement
            </span>
            <select
              value={statementId}
              onChange={(event) => setStatementId(event.target.value)}
              className="field-input rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Choose a verified statement</option>
              {data.problemStatements.map((statement) => (
                <option key={statement.id} value={statement.id}>
                  {statement.statement_code} · {statement.title}
                </option>
              ))}
            </select>
          </label>
          {data.problemStatements.length === 0 && (
            <p className="text-sm text-amber-200">
              The SIH desk has not published verified problem statements yet.
            </p>
          )}
          <Field label="Solution title" value={title} onChange={setTitle} />
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Solution summary
            </span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={6}
              className="field-input resize-none rounded-lg px-3 py-2.5 text-sm"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Repository URL (optional)"
              value={repositoryUrl}
              type="url"
              onChange={setRepositoryUrl}
            />
            <Field label="Demo URL (optional)" value={demoUrl} type="url" onChange={setDemoUrl} />
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-hairline p-3">
            <input
              ref={deckInput}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void chooseDeck(file);
              }}
            />
            <button
              type="button"
              disabled={deckBusy || saving}
              onClick={() => deckInput.current?.click()}
              className="btn-ghost rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {deckBusy
                ? "Uploading PDF…"
                : deckPath
                  ? "Replace presentation PDF"
                  : "Attach presentation PDF"}
            </button>
            {deckPath && (
              <a
                href={`/api/public/media/${deckPath}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-widest text-silver hover:text-foreground"
              >
                View attached PDF
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => submit(false)}
              className="btn-ghost rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              <Save size={14} /> Save draft
            </button>
            <button
              type="button"
              disabled={saving || data.problemStatements.length === 0}
              onClick={() => submit(true)}
              className="btn-primary rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              <Send size={14} /> Final submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityLog({ items }: { items: TeamData["activities"] }) {
  if (!items.length) return null;
  return (
    <div className="surface-card rounded-2xl p-6">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-silver">Activity</p>
      <ol className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 text-sm text-muted-foreground">
            <Check size={14} className="mt-1 shrink-0 text-silver" />
            <span>{item.summary}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input rounded-lg px-3 py-2 text-sm"
      />
    </label>
  );
}
