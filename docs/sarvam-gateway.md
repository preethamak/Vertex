# Sarvam team gateway (experimental)

This implements only `POST /api/sarvam/translate`. It is disabled by default. It is not a general Sarvam proxy and does not support speech, streaming, document, or LLM APIs. Confirm the startup grant permits the event before enabling it.

The team key is created in the admin console for an approved registration. It is shown once; rotating revokes the old key and preserves the allowance already used. Give it privately to the team lead. Never publish it in client-side code. The Sarvam key stays on the server.

The gateway conservatively debits ₹2 per 1,000 UTF-8 bytes (1 credit assumed equal to ₹1), based on the published pay-as-you-go translation price. Bytes may exceed Sarvam's character count, so the debit is an estimate, not actual billing. Verify the credit-to-rupee conversion, plan, billing rules and rate before use. The ledger atomically reserves the full estimate before each upstream request. Failed or uncertain requests retain the reservation and require manual reconciliation; they are not automatically refunded. Approved registration status and an active key are checked for every request. The database limits apply across concurrent application instances. Sarvam's shared account rate limits still apply.

Before enabling: apply the migration, configure `SARVAM_API_KEY` as a server secret, verify rates and authorisation, test with a small real request, compare with Sarvam's billing, and set `SARVAM_GATEWAY_ENABLED=true` only after validation. The key owner is responsible for monitoring the shared account. Do not deploy as operational until these checks pass.

Example:

```sh
curl https://vertex-club.vercel.app/api/sarvam/translate \
  -H 'Authorization: Bearer TEAM_KEY' -H 'Content-Type: application/json' \
  -d '{"input":"Hello", "source_language_code":"en-IN", "target_language_code":"hi-IN"}'
```
