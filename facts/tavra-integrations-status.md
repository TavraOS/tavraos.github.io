# Tavra Integrations Status

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
