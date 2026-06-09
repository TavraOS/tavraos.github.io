# Tavra Website Deployment Contract

This repository is the TavraOS GitHub Pages website.

The only allowed remote for this repository is `TavraOS/tavraos.github.io`.

The intended GitHub Pages URL is:

`https://tavraos.github.io/`

The intended custom domain will be:

`www.tavraos.com`

The Hagerlabs website at `https://www.hagerlabs.com` is completely separate.

The Hagerlabs GitHub Pages repository must never be cloned, edited, committed to, pushed to, reconfigured, or otherwise touched from this project.

Future Codex sessions must inspect this contract before making website changes.

Future Codex sessions must verify the git remote before committing or pushing. The remote must be one of:

- `https://github.com/TavraOS/tavraos.github.io.git`
- `git@github.com:TavraOS/tavraos.github.io.git`

If the remote points to anything involving Hagerlabs, Wes Hager's personal GitHub Pages repository, `username.github.io`, `hagerlabs.com`, or any non-TavraOS repository, stop immediately and explain the problem.

No Tavra non-website application, server, cloud-code, mobile-app source, or DNS changes belong in this repository.

This website repository should remain static and safe to deploy through GitHub Pages.

## Public Website, SEO, and LLM Discoverability Contract

### 1. Truthfulness rule

Public pages must not claim unsupported provider-specific integrations, live POS injection, customer metrics, marketplace availability, partner approval, or customer deployments unless verified by current code/config/docs and explicitly approved. Tavra may be described as taking to-go orders and supporting configured secure payment workflows where restaurant setup supports that workflow, but public copy must not claim every third-party payment/POS/reservation path is universally live.

### 2. Crawlability rule

Every new public page must have a unique title, meta description, H1, canonical URL, internal links, sitemap entry, and, where appropriate, JSON-LD structured data.

### 3. LLM discoverability rule

Any major product-positioning change must update `llms.txt`, `llms-full.txt`, and relevant public Markdown fact files.

### 4. Structured data rule

JSON-LD must be complete, valid, and truthful. Do not add fake ratings, reviews, prices, `aggregateRating`, or unsupported `sameAs` links.

### 5. Integration wording rule

Use `available`, `active`, `integration-ready`, `planned`, `approval-dependent`, and `future` carefully. If a third-party provider is named, the page must clearly distinguish between active capabilities and planned/provider-approved paths.

### 5a. Order and payment positioning rule

Do not describe Tavra as merely detecting that a caller might want food. Tavra public copy should say Tavra takes to-go orders, answers menu questions, handles modifiers and corrections, reads orders back, and supports configured secure payment workflows. Use setup-specific language for POS submission, payment availability, provider approvals, and marketplace status.

### 5b. Public FAQ authority rule

Public FAQ answers must be grounded in Tavra's current code, app configuration surfaces, deployed product behavior, or explicitly approved product status. Do not publish unsupported generic purchasing advice as Tavra's answer. If a truthful public answer exposes a missing restaurant-facing control, design or build that product control before presenting the answer as handled.

### 5c. System Fallback wording rule

Public fallback copy must distinguish local store-device outages from provider API/auth failures and kitchen printer status after a POS order is accepted. Do not collapse all outage cases into “connected system unavailable.” If store devices are offline but the provider cloud is reachable, Tavra may be described as submitting the order to the provider cloud and tracking kitchen print status separately. If the provider API is unavailable or authorization is broken, Tavra may be described as saving the order in Operations for staff follow-up and using configured System Fallback behavior.

### 6. Competitor/comparison-page rule

Do not publish competitor comparison pages with named competitors unless explicitly requested by Wes. If requested later, comparisons must be factual, fair, non-defamatory, and based on public information. Do not use competitor trademarks in misleading page titles or imply affiliation.

### 7. Metrics/case-study rule

Do not invent pilot metrics. Case studies may include placeholders for future verified results, but placeholders must not be presented as actual outcomes.

### 8. Demo preservation rule

Public-site SEO changes must not break the live Tavra demo modal, phone entry, voice selection, E.164 formatting, selected voice payload, or demo call endpoint.

### 9. Static-site simplicity rule

Do not add a heavy framework or build system unless explicitly requested. Keep GitHub Pages deployment simple.

## Portal Contract

The `/portal/` route is an authenticated Tavra account surface hosted as static GitHub Pages files. Static portal files must never contain Parse, payment, voice, telephony, POS, or other service secrets. Login and account verification must go through Tavra backend endpoints.

Portal pages must honor `BusinessMembership` module permissions returned by the backend. The backend remains the source of truth for read/write enforcement; frontend permission displays are only UI hints and must not replace server-side checks.

The portal should stay `noindex` unless explicitly approved for public indexing. Marketing/SEO changes must not expose authenticated portal URLs in the sitemap as public landing pages.
