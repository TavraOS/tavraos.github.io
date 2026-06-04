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
