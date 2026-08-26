# Fan Works LLC SOC 2 Batch 2 execution log

Execution date: 2026-08-25

## Comp AI changes completed

- Corrected the contradictory hosting and subservice Context entries to distinguish the live FanWorks.io Railway/GitHub delivery boundary from the Tessara Azure boundary.
- Quarantined four unsupported narrative Context entries and explicitly marked five remaining factual claims unverified pending management confirmation.
- Added GitHub, Cloudflare, Comp AI, Resend, and Google Workspace to Vendors; assigned Scott Jones as interim owner; left assessments open/not assessed.
- Uploaded `delivery-environment-summary.json` to Separation of Environments, set the task to In Progress, and assigned Scott Jones. The task was not marked Complete.
- Applied the live queue of 423 framework blocks across 23 policies as separate draft versions. A sampled Versions tab showed the prior published version still live and a new draft labeled "Applied framework template updates." No draft was published and no acknowledgment was requested.

## Source-control execution boundary

- Review branch: `codex/soc2-batch-2`.
- Included application changes are limited to dependency lockfile remediation, security-header middleware/tests, CI, CODEOWNERS, and the pull-request template.
- Raw cloud evidence, tenant identifiers, access-review principals, and internal gap details are retained locally and are not intended for the public repository branch.
- Unrelated website-design changes already present in the worktree are excluded.
- The pull request must remain unmerged and undeployed until separately approved.

## Proposed protections — not applied

### `main` branch

- Require a pull request before merging.
- Require at least one approval from someone other than the author and dismiss stale approvals after new commits.
- Require the `Test, build, and audit` check to pass and require branches to be up to date before merge.
- Require conversation resolution; block force pushes and branch deletion; apply rules to administrators without bypass.

### GitHub `production` environment

- Permit deployments only from the protected `main` branch.
- Require a named management reviewer other than the deployer; reviewer GitHub identity must be confirmed before configuration.
- Prevent self-review if the plan supports it; use a zero-minute wait timer unless management approves a delay.
- Do not permit administrator bypass after the reviewer group is confirmed.

These rules require a separate approval because the repository currently has no recorded branch/environment protection and the exact reviewer identity must be confirmed.
