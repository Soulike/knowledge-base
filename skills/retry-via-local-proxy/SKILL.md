---
name: retry-via-local-proxy
description: Retry read-only network fetches through a detected local HTTP or SOCKS5 proxy on 127.0.0.1 ports 1087 and 1080. Use after direct web, documentation, API, package metadata, clone, or download requests fail with connection, DNS, timeout, TLS, or HTTP 403 errors.
---

# Retry Via Local Proxy

Treat a local proxy as a bounded fallback for the same retrieval, not as a
persistent network setting.

## Workflow

1. Record the direct failure and confirm that replay is safe. Retry `GET`,
   `HEAD`, list, clone, and download operations automatically. Ask before
   replaying `POST`, `PUT`, `PATCH`, `DELETE`, uploads, or commands with side
   effects. Preserve the target, request semantics, headers, and credentials;
   keep secrets out of logs.

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

3. Retry the original request through each usable candidate, stopping at the
   first success. Prefer the client's per-command proxy flag. For example:

   ```bash
   curl --proxy "$proxy" <original curl arguments>
   git -c http.proxy="$proxy" <original read-only git command>
   ```

   If a client only supports environment variables, scope them to that single
   invocation. Use `HTTP_PROXY` and `HTTPS_PROXY` for an HTTP proxy, or
   `ALL_PROXY=socks5h://127.0.0.1:<port>` for SOCKS5. Also set the lowercase
   equivalent when the client requires it. Confirm that the client actually
   honored the proxy. If the current network tool has no proxy support, use a
   proxy-capable local client for an equivalent read-only fetch.

4. Keep the fallback bounded. Never write proxy settings to shell profiles,
   system settings, global Git config, or persistent package-manager config.
   If every proxy attempt fails, report the direct error and the candidates
   tested. If `403` remains after the proxy pass, treat it as an authentication
   or access-policy result; stop rather than rotating identities or attempting
   to bypass the restriction.
