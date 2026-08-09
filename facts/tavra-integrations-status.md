# Tavra Integrations Status

**Last reconciled:** August 8, 2026

Current v1 posture:

- Square is the only intended v1 POS. It is `Partial`: production Square/test-Stripe checkout evidence exists, but live-money connected-merchant settlement and physical printer/KDS output are not production-accepted.
- Clover is approval-dependent. The developer account is in review; separate app approval, production credentials, and real-merchant acceptance still follow.
- Toast is approval-dependent. Tavra's integration-partner application was submitted approximately July 18, 2026, with no response as of August 8; authoritative tax and real-restaurant acceptance also remain incomplete.
- Do not describe live restaurant phone payments or kitchen printing as generally available until a merchant has passed Tavra's controlled live-payment, POS-reconciliation, recovery, and exactly-once physical-output acceptance.

Public Tavra pages must be careful with integration wording.

Use these terms precisely:

- **Available** or **active** only when the current public repo and approved product status support the claim.
- **Integration-ready** for Tavra architecture or workflow concepts that are built to connect through approved paths.
- **Planned**, **approval-dependent**, or **future** for third-party provider paths that are not publicly verified as active.

Do not claim live third-party POS injection, live payment processing, marketplace listing, approved provider status, or reservation-system sync unless current public code/config/docs and explicit approval support it.

Provider names such as Clover, Square, Toast, OpenTable, Resy, Tock, SevenRooms, and Google must be used carefully. Public pages should distinguish active Tavra workflow capabilities from planned or provider-approved connection paths.

When an order/payment/printing path has an outage, public copy must separate the failure case:

- Store devices offline, provider cloud reachable: Tavra can submit the order to the provider cloud and track kitchen print status separately.
- Provider API unavailable or authorization broken: Tavra saves the order in Operations for staff follow-up and can use configured System Fallback behavior.
- Printer offline after the POS accepts the order: the order remains submitted, while kitchen print status is tracked separately.

Do not imply Tavra completes a provider action that the provider API could not accept.
