# Change management procedure

Effective status: Draft for management approval

Owner: Scott Jones (interim)

## Scope

This procedure applies to source, application, infrastructure, vendor configuration, security settings, policies, data flows, and other changes that can affect the Fan Works SOC 2 system boundary.

## Standard change

1. Create a branch or otherwise isolate the proposed change from production.
2. Open a pull request or change record describing purpose, affected systems/data, risk, verification, deployment, and rollback.
3. Run the required automated tests, production build, and production dependency audit.
4. Obtain review from someone other than the author when staffing permits. If segregation is not possible, document the owner self-review and a compensating post-deployment review.
5. Resolve review comments and obtain approval before merge/deployment.
6. Deploy through the approved production path.
7. Verify the deployed revision, health, security-relevant behavior, and user-facing result.
8. Retain the pull request/change record, checks, approval, deployment identifier/SHA, verification, exceptions, and rollback outcome.

## Emergency change

An emergency change is limited to an active security, availability, legal, or material customer-impact event where the standard timeline would increase harm.

- Record the emergency, approver, scope, reason, risk, minimal change, verification, and rollback before deployment when feasible.
- Do not use the emergency path merely for convenience or schedule pressure.
- Complete independent or management review and the full evidence record promptly after stabilization.
- Link the change to the incident and corrective-action records.

## Infrastructure and vendor configuration

Use the same record for Azure, Railway, GitHub, Cloudflare, Auth0, Google Workspace, Comp AI, and other administrative changes. Capture a sanitized before state, approval, exact commands/settings or provider activity record, validation, and sanitized after state. Never place secret values in the change record.

## Policy and compliance changes

Policy, risk, scope, evidence-status, questionnaire, Trust Portal, and auditor-facing changes require factual review and an identified approver. Publishing a policy or marking evidence complete is a representation, not a clerical update.

## Proposed technical enforcement

- GitHub `main` protected from direct and force pushes.
- Pull request required with at least one approval and resolved conversations.
- `Test, build, and audit` CI job required.
- GitHub/Railway production deployment gate with approved branch and reviewer appropriate to the operating model.
- CODEOWNERS and pull-request template retained in the repository.

## Control-start boundary

The repository artifacts prepared on 2026-08-25 are local-only and do not prove this procedure is operating. The control begins only after approval, source-control adoption, and enforcement. Type II evidence must come from changes performed during the agreed observation period.
