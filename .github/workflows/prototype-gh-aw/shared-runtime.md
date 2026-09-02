---
tools:
  github:
    mode: gh-proxy
    read-only: true
    allowed:
      - issue_read
      - search_issues
      - pull_request_read
      - get_commit
      - get_file_contents
mcp-servers:
  tavily:
    type: http
    url: https://mcp.tavily.com/mcp/
    headers:
      Authorization: Bearer ${{ secrets.TAVILY_API_KEY }}
    allowed:
      - tavily_search
      - tavily_extract

network:
  allowed:
    - mcp.tavily.com

pre-agent-steps:
  - name: Install floating external review Skills
    run: >-
      npx --yes skills@latest add mattpocock/skills
      --agent github-copilot
      --skill codebase-design tdd writing-for-agents
      --copy
      --yes
      --full-depth

safe-outputs:
  staged: ${{ vars.GH_AW_STAGED == 'true' }}
  noop:
    report-as-issue: false
  report-incomplete:
    create-issue: false
  threat-detection:
    continue-on-error: false
---

The runtime is a throwaway v0.87.10 integration prototype. It centralizes the
read-only tools, remote research service, sandbox network boundary, runtime
Skill installation, staged-mode switch, incomplete-result behavior, and threat
detection shared by the task workflows.
