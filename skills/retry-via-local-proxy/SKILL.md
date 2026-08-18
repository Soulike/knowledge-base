---
name: retry-via-local-proxy
description: Retry failed proxy-capable network requests, including retrievals, API mutations, uploads, and downloads, through a detected local HTTP or SOCKS5 proxy on 127.0.0.1 ports 1087 and 1080. Use when a direct request fails with a connection, DNS, timeout, TLS, or HTTP 403 error, or when cloning an HTTP(S) Git repository times out.
---

# Retry Via Local Proxy

Treat a local proxy as a bounded fallback for the same request, not as a
persistent network setting.

## Workflow

1. Record the direct failure and classify replay safety from the operation's
   contract, the failure point, and any observable server state. Do not infer
   safety from the HTTP method alone. Retry a read-only or idempotent operation
   automatically when the original target and arguments can be preserved. For
   a non-idempotent operation with side effects, replay only when evidence shows
   that the original attempt did not reach the server, the same idempotency key
   or operation identifier guarantees duplicate suppression, or the user
   explicitly accepts the duplicate-effect risk after being told that the
   original outcome is unknown. Otherwise query a status or reconciliation
   interface when one exists, or report the unknown outcome without replaying.

   Also retry a timed-out `git clone` automatically when its remote uses
   `http://` or `https://` and its destination is absent or is an empty
   directory created by the failed attempt. Preserve any other destination and
   ask before deleting or replacing it. Preserve the original target, method,
   body, headers, credentials, and idempotency mechanism; keep secrets out of
   logs and keep TLS verification enabled.

2. Probe these candidates once each with short timeouts:

   - `http://127.0.0.1:1087`
   - `socks5h://127.0.0.1:1087`
   - `socks5h://127.0.0.1:1080`
   - `http://127.0.0.1:1080`

   Test the proxy protocol against the same target or its origin. A listening
   TCP port alone is insufficient. With curl, use a read-only probe such as:

   ```bash
   curl --silent --show-error --output /dev/null \
     --connect-timeout 2 --max-time 10 \
     --proxy "$proxy" --head "$target"
   ```

   Treat a completed proxy negotiation or an origin HTTP response as evidence
   that the candidate is usable. If the target does not support `HEAD`, use a
   small idempotent `GET` instead. Finish probing when one usable candidate is
   found or all four candidates have failed.

3. After step 1 authorizes replay, retry the original request through each
   usable candidate, stopping at the first success. Prefer the client's
   per-command proxy flag. For example:

   ```bash
   curl --proxy "$proxy" <original curl arguments>
   git -c http.proxy="$proxy" <original git command>
   ```

   If a client only supports environment variables, scope them to that single
   invocation. Use `HTTP_PROXY` and `HTTPS_PROXY` for an HTTP proxy, or
   `ALL_PROXY=socks5h://127.0.0.1:<port>` for SOCKS5. Also set the lowercase
   equivalent when the client requires it. Confirm that the client actually
   honored the proxy. If the current network tool has no proxy support, use a
   proxy-capable local client only when it can preserve the request semantics,
   body, authentication, and idempotency mechanism; otherwise report the
   limitation.

   Reuse an existing idempotency key instead of generating a new one for a
   replay. Preserve the original client's redirect and authentication behavior.
   When a connection or response failure leaves a side effect's outcome
   unknown, reconcile that operation before attempting it again.

   Before replaying a timed-out HTTP(S) clone, verify repository access with a
   lightweight Git request through the same candidate, then preserve the
   original clone arguments for the full retry:

   ```bash
   git -c http.proxy="$proxy" ls-remote "$repo_url" HEAD
   git -c http.proxy="$proxy" clone <original clone arguments>
   ```

   A successful curl probe proves proxy transport, while `ls-remote` proves
   that Git can reach the repository. Run the full clone only after both pass.

4. Keep the fallback bounded. Never write proxy settings to shell profiles,
   system settings, global Git config, or persistent package-manager config.
   If every proxy attempt fails, report the direct error and the candidates
   tested. For an operation with side effects, report whether it was not sent,
   safely replayed, reconciled, or left with an unknown outcome, together with
   the idempotency evidence used. For a clone timeout, distinguish a
   proxy-transport failure, a repository-access failure, and a bulk-transfer
   failure, and preserve any partial destination. If `403` remains after the
   proxy pass, treat it as an authentication or access-policy result; stop
   rather than rotating identities or attempting to bypass the restriction.
