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

Public pages must not claim live integrations, live POS injection, live payment processing, customer metrics, marketplace availability, partner approval, or customer deployments unless verified by current code/config/docs and explicitly approved.

### 2. Crawlability rule

Every new public page must have a unique title, meta description, H1, canonical URL, internal links, sitemap entry, and, where appropriate, JSON-LD structured data.

### 3. LLM discoverability rule

Any major product-positioning change must update `llms.txt`, `llms-full.txt`, and relevant public Markdown fact files.

### 4. Structured data rule

JSON-LD must be complete, valid, and truthful. Do not add fake ratings, reviews, prices, `aggregateRating`, or unsupported `sameAs` links.

### 5. Integration wording rule

Use `available`, `active`, `integration-ready`, `planned`, `approval-dependent`, and `future` carefully. If a third-party provider is named, the page must clearly distinguish between active capabilities and planned/provider-approved paths.

### 6. Competitor/comparison-page rule

Do not publish competitor comparison pages with named competitors unless explicitly requested by Wes. If requested later, comparisons must be factual, fair, non-defamatory, and based on public information. Do not use competitor trademarks in misleading page titles or imply affiliation.

### 7. Metrics/case-study rule

Do not invent pilot metrics. Case studies may include placeholders for future verified results, but placeholders must not be presented as actual outcomes.

### 8. Demo preservation rule

Public-site SEO changes must not break the live Tavra demo modal, phone entry, voice selection, E.164 formatting, selected voice payload, or demo call endpoint.

### 9. Static-site simplicity rule

Do not add a heavy framework or build system unless explicitly requested. Keep GitHub Pages deployment simple.
