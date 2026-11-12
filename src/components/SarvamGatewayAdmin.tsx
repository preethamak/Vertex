import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  disableSarvamGatewayKey,
  issueSarvamGatewayKey,
  listSarvamGateway,
} from "@/lib/sarvam-gateway.functions";

type Registration = { id: string; name: string; email: string; status: string; form_data: unknown };
type GatewayTeam = {
  registration_id: string;
  key_prefix: string;
  allowance: number;
  spent: number;
  active: boolean;
};

export function SarvamGatewayAdmin({ registrations }: { registrations: Registration[] }) {
  const list = useServerFn(listSarvamGateway);
  const issue = useServerFn(issueSarvamGatewayKey);
  const disable = useServerFn(disableSarvamGatewayKey);
  const [teams, setTeams] = useState<GatewayTeam[]>([]);
  const [secret, setSecret] = useState<{ name: string; key: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      setTeams(await list());
      setError("");
    } catch {
      setError("Gateway database is not configured yet.");
    }
  }, [list]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const eligible = registrations.filter((r) => r.status === "approved");
  return (
    <section className="border border-hairline bg-card/40 p-6">
      <h2 className="font-display text-2xl font-semibold">Team API gateway</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Translation only. Each approved team receives a 500-credit estimated allowance. Usage is
        conservatively reserved and can differ from Sarvam billing.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        The gateway must be configured and tested before teams use it. Share team keys privately;
        creating a new key revokes the previous one.
      </p>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {secret && (
        <div className="mt-4 border border-hairline p-4">
          <p className="text-sm font-semibold">
            Key for {secret.name} — copy now; it will not be shown again.
          </p>
          <code className="mt-2 block break-all text-sm">{secret.key}</code>
          <button
            className="mt-2 underline"
            onClick={() => void navigator.clipboard.writeText(secret.key)}
          >
            Copy key
          </button>
          <button className="ml-4 underline" onClick={() => setSecret(null)}>
            Dismiss
          </button>
        </div>
      )}
      <div className="mt-4 grid gap-3">
        {eligible.length === 0 && (
          <p className="text-sm text-muted-foreground">No approved teams yet.</p>
        )}
        {eligible.map((r) => {
          const team = teams.find((t) => t.registration_id === r.id);
          const form =
            r.form_data && typeof r.form_data === "object"
              ? (r.form_data as Record<string, unknown>)
              : {};
          const name = typeof form.team_name === "string" ? form.team_name : r.name;
          return (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-3"
            >
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.email} ·{" "}
                  {team
                    ? `${(team.spent / 1e6).toFixed(3)} / ${(team.allowance / 1e6).toFixed(0)} credits reserved · ${team.active ? "Active" : "Revoked"}`
                    : "No key issued"}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  disabled={busy || !!error}
                  className="underline disabled:opacity-40"
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const result = await issue({ data: { registrationId: r.id } });
                      setSecret({ name, key: result.key });
                      await refresh();
                    } catch {
                      toast.error("Could not issue key.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {team ? "Rotate key" : "Issue key"}
                </button>
                {team?.active && (
                  <button
                    disabled={busy}
                    className="underline"
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await disable({ data: { registrationId: r.id } });
                        await refresh();
                      } catch {
                        toast.error("Could not revoke key.");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
