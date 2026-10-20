# KATALOG SKILL — Kantor KCSH

Diambil: 2026-10-19 dari 8 repo GitHub. Total **466 SKILL.md** + **304 definisi agen** (agency-agents) + ComfyUI (aplikasi).

Semua skill ini disiapkan untuk dimasukkan ke kantor tanpa terkecuali (tahap integrasi berikutnya).

Sumber mentah: `~/workspace/kantor-kcsh/repo-sources/<repo>/`

---

## ai-memory — 20 skill
https://github.com/akitaonrails/ai-memory — AI memory: durable wiki pages, handoff, retrieval, agent-to-agent messaging

- **ai-memory-durable-pages** — Use this skill for any explicit wiki mutation in ai-memory: saving durable or time-bounded project knowledge, recording a rule or annotation, updating a note, or deleting a memory page. Trigger by semantic intent rather   `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-durable-pages]`
- **ai-memory-durable-pages** — Use this skill for any explicit wiki mutation in ai-memory: saving durable or time-bounded project knowledge, recording a rule or annotation, updating a note, or deleting a memory page. Trigger by semantic intent rather   `[ai-memory/plugins/claude-code/skills/ai-memory-durable-pages]`
- **ai-memory-durable-pages** — Use this skill for any explicit wiki mutation in ai-memory: saving durable or time-bounded project knowledge, recording a rule or annotation, updating a note, or deleting a memory page. Trigger by semantic intent rather   `[ai-memory/plugins/codex/skills/ai-memory-durable-pages]`
- **ai-memory-handoff** — Use this skill for any request whose goal is session continuity across agents or time: finding a pending handoff, resuming previous work, saving next-session context, wrapping up, or discarding a mistaken handoff. Trigge  `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-handoff]`
- **ai-memory-handoff** — Use this skill for any request whose goal is session continuity across agents or time: finding a pending handoff, resuming previous work, saving next-session context, wrapping up, or discarding a mistaken handoff. Trigge  `[ai-memory/plugins/claude-code/skills/ai-memory-handoff]`
- **ai-memory-handoff** — Use this skill for any request whose goal is session continuity across agents or time: finding a pending handoff, resuming previous work, saving next-session context, wrapping up, or discarding a mistaken handoff. Trigge  `[ai-memory/plugins/codex/skills/ai-memory-handoff]`
- **ai-memory-learning-maintenance** — Use this skill for any ai-memory knowledge-base maintenance request: consolidating observations, reviewing session lessons, proposing durable learnings, auditing or linting the wiki, finding contradictions, pruning stale  `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-learning-maintenance]`
- **ai-memory-learning-maintenance** — Use this skill for any ai-memory knowledge-base maintenance request: consolidating observations, reviewing session lessons, proposing durable learnings, auditing or linting the wiki, finding contradictions, pruning stale  `[ai-memory/plugins/claude-code/skills/ai-memory-learning-maintenance]`
- **ai-memory-learning-maintenance** — Use this skill for any ai-memory knowledge-base maintenance request: consolidating observations, reviewing session lessons, proposing durable learnings, auditing or linting the wiki, finding contradictions, pruning stale  `[ai-memory/plugins/codex/skills/ai-memory-learning-maintenance]`
- **ai-memory-messaging** — Use this skill for cross-project agent-to-agent messaging: sending a request to another project's inbox, checking or popping this project's inbox, or retracting a message you sent. Trigger by semantic intent (delegate to  `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-messaging]`
- **ai-memory-messaging** — Use this skill for cross-project agent-to-agent messaging: sending a request to another project's inbox, checking or popping this project's inbox, or retracting a message you sent. Trigger by semantic intent (delegate to  `[ai-memory/plugins/claude-code/skills/ai-memory-messaging]`
- **ai-memory-messaging** — Use this skill for cross-project agent-to-agent messaging: sending a request to another project's inbox, checking or popping this project's inbox, or retracting a message you sent. Trigger by semantic intent (delegate to  `[ai-memory/plugins/codex/skills/ai-memory-messaging]`
- **ai-memory-retrieval** — Use this skill for any request whose goal is read-only retrieval from ai-memory: project history, prior context, decisions, rules, gotchas, recent activity, full wiki pages, or status/briefing. Trigger by semantic intent  `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-retrieval]`
- **ai-memory-retrieval** — Use this skill for any request whose goal is read-only retrieval from ai-memory: project history, prior context, decisions, rules, gotchas, recent activity, full wiki pages, or status/briefing. Trigger by semantic intent  `[ai-memory/plugins/claude-code/skills/ai-memory-retrieval]`
- **ai-memory-retrieval** — Use this skill for any request whose goal is read-only retrieval from ai-memory: project history, prior context, decisions, rules, gotchas, recent activity, full wiki pages, or status/briefing. Trigger by semantic intent  `[ai-memory/plugins/codex/skills/ai-memory-retrieval]`
- **ai-memory-routing-install** — Use this skill for any request to install, refresh, repair, inspect, or remove ai-memory's agent-facing routing: managed instruction snippets, Agent Skills, CLAUDE.md/AGENTS.md integration, or local/global skill roots. T  `[ai-memory/crates/ai-memory-core/src/routing_skills/ai-memory-routing-install]`
- **ai-memory-routing-install** — Use this skill for any request to install, refresh, repair, inspect, or remove ai-memory's agent-facing routing: managed instruction snippets, Agent Skills, CLAUDE.md/AGENTS.md integration, or local/global skill roots. T  `[ai-memory/plugins/claude-code/skills/ai-memory-routing-install]`
- **ai-memory-routing-install** — Use this skill for any request to install, refresh, repair, inspect, or remove ai-memory's agent-facing routing: managed instruction snippets, Agent Skills, CLAUDE.md/AGENTS.md integration, or local/global skill roots. T  `[ai-memory/plugins/codex/skills/ai-memory-routing-install]`
- **status** — Check whether ai-memory is capturing this session and its memory tools can reach the server. Run it when memory looks missing or after installing or upgrading ai-memory. disable-model-invocation: true --- # ai-memory sta  `[ai-memory/plugins/claude-code/skills/status]`
- **status** — Check whether ai-memory is capturing this session and its memory tools can reach the server. Run it when memory looks missing or after installing or upgrading ai-memory. disable-model-invocation: true --- # ai-memory sta  `[ai-memory/plugins/codex/skills/status]`

## anti-slop — 6 skill
https://github.com/miqdadbadjuber/anti-slop — Anti-slop: filter kualitas untuk coding agent & copywriting

- **antislop** — Anti Slop: Rules for AI Coding Agents. The core filter. Load always to stop generic AI slop." allowed-tools: Read Write Edit Glob Grep --- # antislop > Anti Slop: Rules for AI Coding Agents > Follow these rules whenever   `[anti-slop/skills/antislop]`
- **antislop-code** — Code comment hygiene for AI coding agents: remove generic AI-slop comments, keep the valuable ones, never touch the code." allowed-tools: Read Write Edit Glob Grep --- # antislop-code > Anti Slop: Rules for AI Coding Age  `[anti-slop/skills/antislop-code]`
- **antislop-copywriting** — Copy and text skill for antislop. Use when writing or editing prose: headlines, tone, CTAs, and anti-AI-writing patterns. Load with the core." allowed-tools: Read Write Edit Glob Grep --- # antislop-copywriting > Anti Sl  `[anti-slop/skills/antislop-copywriting]`
- **antislop-human** — Human and accessibility skill for antislop. Contrast, keyboard, focus, and states for real people. Includes the contrast checker." allowed-tools: Bash(python *) Bash(python3 *) Read Write Edit Glob Grep --- # antislop-hu  `[anti-slop/skills/antislop-human]`
- **antislop-layoutmobile** — Mobile layout skill for antislop. Use for layouts that reflow across screen sizes, phone to desktop: grids, overflow, tap targets. Load with the core." allowed-tools: Read Write Edit Glob Grep --- # antislop-layoutmobile  `[anti-slop/skills/antislop-layoutmobile]`
- **antislop-ui** — UI and visual skill for antislop. Use when building or editing any interface: color, layout, components, motion. Load with the core." allowed-tools: Read Write Edit Glob Grep --- # antislop-ui > Anti Slop: Rules for AI C  `[anti-slop/skills/antislop-ui]`

## agents — 185 skill
https://github.com/wshobson/agents — Koleksi besar skill multi-disiplin (dev, audit, data, dsb)

- **accessibility-compliance** — Implement WCAG 2.2 compliant interfaces with mobile accessibility, inclusive design patterns, and assistive technology support. Use when auditing accessibility, implementing ARIA patterns, building for screen readers, or  `[agents/plugins/ui-design/skills/accessibility-compliance]`
- **ai-debt-detector** — >- Use after generating code, after accepting AI suggestions, or when reviewing AI-written modules. Also use when code works but feels brittle, when error handling seems thin, when orphaned resources or missing cleanup a  `[agents/plugins/skill-forge-essentials/skills/ai-debt-detector]`
- **airflow-dag-patterns** — Build production Apache Airflow DAGs with best practices for operators, sensors, testing, and deployment. Use when creating data pipelines, orchestrating workflows, or scheduling batch jobs. --- # Apache Airflow DAG Patt  `[agents/plugins/data-engineering/skills/airflow-dag-patterns]`
- **angular-migration** — Migrate from AngularJS to Angular using hybrid mode, incremental component rewriting, and dependency injection updates. Use when upgrading AngularJS applications, planning framework migrations, or modernizing legacy Angu  `[agents/plugins/framework-migration/skills/angular-migration]`
- **anti-reversing-techniques** — Understand anti-reversing, obfuscation, and protection techniques encountered during software analysis. Use this skill when analyzing malware evasion techniques, when implementing anti-debugging protections for CTF chall  `[agents/plugins/reverse-engineering/skills/anti-reversing-techniques]`
- **api-design-principles** — Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards.   `[agents/plugins/backend-development/skills/api-design-principles]`
- **architecture-decision-records** — Write and maintain Architecture Decision Records (ADRs) following best practices for technical decision documentation. Use when documenting significant technical decisions, reviewing past architectural choices, or establ  `[agents/plugins/documentation-generation/skills/architecture-decision-records]`
- **architecture-patterns** — Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design. Use this skill when designing clean architecture for a new microservice, when refactoring a m  `[agents/plugins/backend-development/skills/architecture-patterns]`
- **async-python-patterns** — Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications. Use when building async APIs, concurrent systems, or I/O-bound applications requiring non-blocking operations. --  `[agents/plugins/python-development/skills/async-python-patterns]`
- **attack-tree-construction** — Build comprehensive attack trees to visualize threat paths. Use when mapping attack scenarios, identifying defense gaps, or communicating security risks to stakeholders. --- # Attack Tree Construction Systematic attack p  `[agents/plugins/security-scanning/skills/attack-tree-construction]`
- **auth-implementation-patterns** — Master authentication and authorization patterns including JWT, OAuth2, session management, and RBAC to build secure, scalable access control systems. Use when implementing auth systems, securing APIs, or debugging secur  `[agents/plugins/developer-essentials/skills/auth-implementation-patterns]`
- **avoid-ai-writing** — Audit and rewrite prose so it stops reading as machine-generated. Use this skill when asked to remove AI-isms, clean up AI writing, edit a draft for AI tells, audit a README, changelog, release note, PR description, or b  `[agents/plugins/avoid-ai-writing/skills/avoid-ai-writing]`
- **backtesting-frameworks** — Build robust backtesting systems for trading strategies with proper handling of look-ahead bias, survivorship bias, and transaction costs. Use when developing trading algorithms, validating strategies, or building backte  `[agents/plugins/quantitative-trading/skills/backtesting-frameworks]`
- **bash-defensive-patterns** — Master defensive Bash programming techniques for production-grade scripts. Use when writing robust shell scripts, CI/CD pipelines, or system utilities requiring fault tolerance and safety. --- # Bash Defensive Patterns C  `[agents/plugins/shell-scripting/skills/bash-defensive-patterns]`
- **bats-testing-patterns** — Master Bash Automated Testing System (Bats) for comprehensive shell script testing. Use when writing tests for shell scripts, CI/CD pipelines, or requiring test-driven development of shell utilities. --- # Bats Testing P  `[agents/plugins/shell-scripting/skills/bats-testing-patterns]`
- **bazel-build-optimization** — Optimize Bazel builds for large-scale monorepos. Use when configuring Bazel, implementing remote execution, or optimizing build performance for enterprise codebases. --- # Bazel Build Optimization Production patterns for  `[agents/plugins/developer-essentials/skills/bazel-build-optimization]`
- **before-you-build** — Pre-build product and feature risk review for founders, product managers, and AI-assisted builders. Use this skill when the user is about to build a landing page, MVP, SaaS product, internal tool, agent workflow, or majo  `[agents/plugins/before-you-build/skills/before-you-build]`
- **billing-automation** — Build automated billing systems for recurring payments, invoicing, subscription lifecycle, and dunning management. Use when implementing subscription billing, automating invoicing, or managing recurring payment systems.   `[agents/plugins/payment-processing/skills/billing-automation]`
- **binary-analysis-patterns** — Master binary analysis patterns including disassembly, decompilation, control flow analysis, and code pattern recognition. Use when analyzing executables, understanding compiled code, or performing static analysis on bin  `[agents/plugins/reverse-engineering/skills/binary-analysis-patterns]`
- **block-no-verify-hook** — Configure a PreToolUse hook to prevent AI agents from skipping git pre-commit hooks with --no-verify and other bypass flags. Use when setting up Claude Code projects that enforce commit quality gates. --- # Block No-Veri  `[agents/plugins/block-no-verify/skills/block-no-verify-hook]`
- **brand-landingpage** — > Brand-first landing page designer — runs a brand-identity interview (colors, typography, shape language), then generates and iterates on a polished landing page via Stitch with deployment-ready HTML. Use when the user   `[agents/plugins/brand-landingpage/skills/brand-landingpage]`
- **changelog-automation** — Automate changelog generation from commits, PRs, and releases following Keep a Changelog format. Use when setting up release workflows, generating release notes, or standardizing commit conventions. --- # Changelog Autom  `[agents/plugins/documentation-generation/skills/changelog-automation]`
- **checkpoint-promotion** — Gate fine-tuned checkpoints with drift budgets, paired comparison, and forgetting checks before promotion. Use after a training run produces a checkpoint, when deciding whether a tuned model ships, or when a promoted mod  `[agents/plugins/llm-finetuning/skills/checkpoint-promotion]`
- **code-review-excellence** — Master effective code review practices to provide constructive feedback, catch bugs early, and foster knowledge sharing while maintaining team morale. Use when reviewing pull requests, establishing review standards, or m  `[agents/plugins/developer-essentials/skills/code-review-excellence]`
- **competitive-landscape** — Analyze competition, identify differentiation opportunities, and develop winning market positioning strategies using Porter's Five Forces, Blue Ocean Strategy, and positioning maps. Use this skill when evaluating competi  `[agents/plugins/startup-business-analyst/skills/competitive-landscape]`
- **connectivity-triage** — Use this skill when debugging active macOS connectivity failures, when an API or MCP service times out or disconnects, when DNS resolution is failing or inconsistent, or when video calls or other interactive traffic show  `[agents/plugins/incident-response/skills/connectivity-triage]`
- **context-driven-development** — >- Creates and maintains project context artifacts (product.md, tech-stack.md, workflow.md, tracks.md) in a `conductor/` directory. Scaffolds new projects from scratch, extracts context from existing codebases, validates  `[agents/plugins/conductor/skills/context-driven-development]`
- **cost-optimization** — Optimize cloud costs across AWS, Azure, GCP, and OCI through resource rightsizing, tagging strategies, reserved instances, and spending analysis. Use when reducing cloud expenses, analyzing infrastructure costs, or imple  `[agents/plugins/cloud-infrastructure/skills/cost-optimization]`
- **cqrs-implementation** — Implement Command Query Responsibility Segregation for scalable architectures. Use when separating read and write models, optimizing query performance, or building event-sourced systems. --- # CQRS Implementation Compreh  `[agents/plugins/backend-development/skills/cqrs-implementation]`
- **data-quality-frameworks** — Implement data quality validation with Great Expectations, dbt tests, and data contracts. Use when building data quality pipelines, implementing validation rules, or establishing data contracts. --- # Data Quality Framew  `[agents/plugins/data-engineering/skills/data-quality-frameworks]`
- **data-storytelling** — Transform data into compelling narratives using visualization, context, and persuasive structure. Use when presenting analytics to stakeholders, creating data reports, or building executive presentations. --- # Data Stor  `[agents/plugins/business-analytics/skills/data-storytelling]`
- **database-migration** — Execute database migrations across ORMs and platforms with zero-downtime strategies, data transformation, and rollback procedures. Use when migrating databases, changing schemas, performing data transformations, or imple  `[agents/plugins/framework-migration/skills/database-migration]`
- **dataset-curation** — Prepare, format, and validate datasets for supervised fine-tuning and preference training. Use when converting raw data into training format, applying chat templates, configuring sequence packing, generating synthetic tr  `[agents/plugins/llm-finetuning/skills/dataset-curation]`
- **dbt-transformation-patterns** — Master dbt (data build tool) for analytics engineering with model organization, testing, documentation, and incremental strategies. Use when building data transformations, creating data models, or implementing analytics   `[agents/plugins/data-engineering/skills/dbt-transformation-patterns]`
- **debugging-strategies** — Master systematic debugging techniques, profiling tools, and root cause analysis to efficiently track down bugs across any codebase or technology stack. Use when investigating bugs, performance issues, or unexpected beha  `[agents/plugins/developer-essentials/skills/debugging-strategies]`
- **defi-protocol-templates** — Implement DeFi protocols with production-ready templates for staking, AMMs, governance, and flash loans. Use when building decentralized finance applications or smart contract protocols. --- # DeFi Protocol Templates Pro  `[agents/plugins/blockchain-web3/skills/defi-protocol-templates]`
- **dependency-upgrade** — Manage major dependency version upgrades with compatibility analysis, staged rollout, and comprehensive testing. Use when upgrading framework versions, updating major dependencies, or managing breaking changes in librari  `[agents/plugins/framework-migration/skills/dependency-upgrade]`
- **deployment-pipeline-design** — Design multi-stage CI/CD pipelines with approval gates, security checks, and deployment orchestration. Use this skill when designing zero-downtime deployment pipelines, implementing canary rollout strategies, setting up   `[agents/plugins/cicd-automation/skills/deployment-pipeline-design]`
- **design-system-patterns** — Build scalable design systems with design tokens, theming infrastructure, and component architecture patterns. Use when creating design tokens, implementing theme switching, building component libraries, or establishing   `[agents/plugins/ui-design/skills/design-system-patterns]`
- **distributed-tracing** — Implement distributed tracing with Jaeger and Tempo to track requests across microservices and identify performance bottlenecks. Use when debugging microservices, analyzing request flows, or implementing observability fo  `[agents/plugins/observability-monitoring/skills/distributed-tracing]`
- **dotnet-backend-patterns** — Master C#/.NET backend development patterns for building robust APIs, MCP servers, and enterprise applications. Covers async/await, dependency injection, Entity Framework Core, Dapper, configuration, caching, and testing  `[agents/plugins/dotnet-contribution/skills/dotnet-backend-patterns]`
- **e2e-testing-patterns** — Master end-to-end testing with Playwright and Cypress to build reliable test suites that catch bugs, improve confidence, and enable fast deployment. Use when implementing E2E tests, debugging flaky tests, or establishing  `[agents/plugins/developer-essentials/skills/e2e-testing-patterns]`
- **embedding-strategies** — Select and optimize embedding models for semantic search and RAG applications. Use when choosing embedding models, implementing chunking strategies, or optimizing embedding quality for specific domains. --- # Embedding S  `[agents/plugins/llm-application-dev/skills/embedding-strategies]`
- **employment-contract-templates** — Create employment contracts, offer letters, and HR policy documents following legal best practices. Use when drafting employment agreements, creating HR policies, or standardizing employment documentation. --- # Employme  `[agents/plugins/hr-legal-compliance/skills/employment-contract-templates]`
- **error-handling-patterns** — Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or im  `[agents/plugins/developer-essentials/skills/error-handling-patterns]`
- **eval-harness-first** — Build the evaluation harness that gates every fine-tuning run — golden sets, per-failure-mode graders, judge calibration, and base-model baselines. Use when starting a fine-tuning effort, when converting traces into an e  `[agents/plugins/llm-finetuning/skills/eval-harness-first]`
- **evaluation-methodology** — PluginEval quality methodology, covering dimensions, rubrics, and scoring formulas. Use this skill when understanding how plugin quality is measured, when interpreting a low score on a specific dimension, when deciding h  `[agents/plugins/plugin-eval/skills/evaluation-methodology]`
- **event-store-design** — Design and implement event stores for event-sourced systems. Use when building event sourcing infrastructure, choosing event store technologies, or implementing event persistence patterns. --- # Event Store Design Compre  `[agents/plugins/backend-development/skills/event-store-design]`
- **fastapi-templates** — Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. Use when building new FastAPI applications or setting up backend API projects. --- # FastAPI Project T  `[agents/plugins/api-scaffolding/skills/fastapi-templates]`
- **file-conversion** — Use when the user needs a local file converted between common image, audio, video, document, or data formats. Select installed tools, preserve originals, and verify the output. --- # Local file conversion Convert with to  `[agents/plugins/file-conversion/skills/file-conversion]`
- **finetuning-method-selection** — Decide whether to fine-tune at all, and route to the right method (SFT, DPO/ORPO/KTO, GRPO/RLVR, continued pretraining) and base model. Use when starting any fine-tuning effort, when unsure whether RAG or prompting would  `[agents/plugins/llm-finetuning/skills/finetuning-method-selection]`
- **gdpr-data-handling** — Implement GDPR-compliant data handling with consent management, data subject rights, and privacy by design. Use when building systems that process EU personal data, implementing privacy controls, or conducting GDPR compl  `[agents/plugins/hr-legal-compliance/skills/gdpr-data-handling]`
- **git-advanced-workflows** — Master advanced Git workflows including rebasing, cherry-picking, bisect, worktrees, and reflog to maintain clean history and recover from any situation. Use when managing complex Git histories, collaborating on feature   `[agents/plugins/developer-essentials/skills/git-advanced-workflows]`
- **github-actions-templates** — Create production-ready GitHub Actions workflows for automated testing, building, and deploying applications. Use when setting up CI/CD with GitHub Actions, automating development workflows, or creating reusable workflow  `[agents/plugins/cicd-automation/skills/github-actions-templates]`
- **gitlab-ci-patterns** — Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners for scalable automation. Use when implementing GitLab CI/CD, optimizing pipeline performance, or setting up automated testing and   `[agents/plugins/cicd-automation/skills/gitlab-ci-patterns]`
- **gitops-workflow** — Implement GitOps workflows with ArgoCD and Flux for automated, declarative Kubernetes deployments with continuous reconciliation. Use when implementing GitOps practices, automating Kubernetes deployments, or setting up d  `[agents/plugins/kubernetes-operations/skills/gitops-workflow]`
- **go-concurrency-patterns** — Master Go concurrency with goroutines, channels, sync primitives, and context. Use when building concurrent Go applications, implementing worker pools, or debugging race conditions. --- # Go Concurrency Patterns Producti  `[agents/plugins/systems-programming/skills/go-concurrency-patterns]`
- **godot-gdscript-patterns** — Master Godot 4 GDScript patterns including signals, scenes, state machines, and optimization. Use when building Godot games, implementing game systems, or learning GDScript best practices. --- # Godot GDScript Patterns P  `[agents/plugins/game-development/skills/godot-gdscript-patterns]`
- **grafana-dashboards** — Create and manage production Grafana dashboards for real-time visualization of system and application metrics. Use when building monitoring dashboards, visualizing metrics, or creating operational observability interface  `[agents/plugins/observability-monitoring/skills/grafana-dashboards]`
- **grounded-vault** — Use when maintaining a durable Markdown knowledge store that agents compile from sources, when every number or quote in a wiki page must trace back to an immutable source, or when compiled pages need cheap drift detectio  `[agents/plugins/documentation-standards/skills/grounded-vault]`
- **grpo-rlvr-training** — Train reasoning and verifiable-task behavior with GRPO and reinforcement learning from verifiable rewards (RLVR). Use when task success is algorithmically checkable (math, code, tool calls, structured output), when desig  `[agents/plugins/llm-finetuning/skills/grpo-rlvr-training]`
- **hads** — Use when writing technical documentation that needs to be readable by both humans and AI models, converting existing docs to HADS format, validating a HADS document, or optimizing documentation for token-efficient AI con  `[agents/plugins/documentation-standards/skills/hads]`
- **helm-chart-scaffolding** — Design, organize, and manage Helm charts for templating and packaging Kubernetes applications with reusable configurations. Use when creating Helm charts, packaging Kubernetes applications, or implementing templated depl  `[agents/plugins/kubernetes-operations/skills/helm-chart-scaffolding]`
- **hermes-tweet** — > Install and operate Hermes Tweet, a Hermes Agent plugin for X/Twitter research, timeline reading, tweet analysis, and approval-gated private or state-changing operations. Use this skill when installing Hermes Tweet, re  `[agents/plugins/hermes-tweet/skills/hermes-tweet]`
- **hybrid-cloud-networking** — Configure secure, high-performance connectivity between on-premises infrastructure and cloud platforms using VPN and dedicated connections. Use when building hybrid cloud architectures, connecting data centers to cloud,   `[agents/plugins/cloud-infrastructure/skills/hybrid-cloud-networking]`
- **hybrid-search-implementation** — Combine vector and keyword search for improved retrieval. Use when implementing RAG systems, building search engines, or when neither approach alone provides sufficient recall. --- # Hybrid Search Implementation Patterns  `[agents/plugins/llm-application-dev/skills/hybrid-search-implementation]`
- **incident-runbook-templates** — Create structured incident response runbooks with step-by-step procedures, escalation paths, and recovery actions. Use this skill when building a service outage runbook for a payment processing system; creating database   `[agents/plugins/incident-response/skills/incident-runbook-templates]`
- **interaction-design** — Design and implement microinteractions, motion design, transitions, and user feedback patterns. Use when adding polish to UI interactions, implementing loading states, or creating delightful user experiences. --- # Inter  `[agents/plugins/ui-design/skills/interaction-design]`
- **istio-traffic-management** — Configure Istio traffic management including routing, load balancing, circuit breakers, and canary deployments. Use when implementing service mesh traffic policies, progressive delivery, or resilience patterns. --- # Ist  `[agents/plugins/cloud-infrastructure/skills/istio-traffic-management]`
- **javascript-testing-patterns** — Implement comprehensive testing strategies using Jest, Vitest, and Testing Library for unit tests, integration tests, and end-to-end testing with mocking, fixtures, and test-driven development. Use when writing JavaScrip  `[agents/plugins/javascript-typescript/skills/javascript-testing-patterns]`
- **k8s-manifest-generator** — Create production-ready Kubernetes manifests for Deployments, Services, ConfigMaps, and Secrets following best practices and security standards. Use when generating Kubernetes YAML manifests, creating K8s resources, or i  `[agents/plugins/kubernetes-operations/skills/k8s-manifest-generator]`
- **k8s-security-policies** — Implement Kubernetes security policies including NetworkPolicy, PodSecurityPolicy, and RBAC for production-grade security. Use when securing Kubernetes clusters, implementing network isolation, or enforcing pod security   `[agents/plugins/kubernetes-operations/skills/k8s-security-policies]`
- **kpi-dashboard-design** — Design effective KPI dashboards with metrics selection, visualization best practices, and real-time monitoring patterns. Use this skill when building an executive SaaS metrics dashboard tracking MRR, churn, and LTV/CAC r  `[agents/plugins/business-analytics/skills/kpi-dashboard-design]`
- **langchain-architecture** — Design LLM applications using LangChain 1.x and LangGraph for agents, memory, and tool integration. Use when building LangChain applications, implementing AI agents, or creating complex LLM workflows. --- # LangChain & L  `[agents/plugins/llm-application-dev/skills/langchain-architecture]`
- **linkerd-patterns** — Implement Linkerd service mesh patterns for lightweight, security-focused service mesh deployments. Use when setting up Linkerd, configuring traffic policies, or implementing zero-trust networking with minimal overhead.   `[agents/plugins/cloud-infrastructure/skills/linkerd-patterns]`
- **llm-evaluation** — Implement comprehensive evaluation strategies for LLM applications using automated metrics, human feedback, and benchmarking. Use when testing LLM performance, measuring AI application quality, or establishing evaluation  `[agents/plugins/llm-application-dev/skills/llm-evaluation]`
- **lora-qlora-recipes** — Configure LoRA and QLoRA supervised fine-tuning with current best-practice hyperparameters. Use when writing or reviewing a LoRA/QLoRA training configuration, choosing rank/alpha/target modules, or deciding between LoRA,  `[agents/plugins/llm-finetuning/skills/lora-qlora-recipes]`
- **market-sizing-analysis** — Calculate TAM/SAM/SOM for market opportunities using top-down, bottom-up, and value theory methodologies. Use this skill when sizing markets, estimating addressable revenue, validating market opportunity for a new ventur  `[agents/plugins/startup-business-analyst/skills/market-sizing-analysis]`
- **memory-forensics** — Master memory forensics techniques including memory acquisition, process analysis, and artifact extraction using Volatility and related tools. Use when analyzing memory dumps, investigating incidents, or performing malwa  `[agents/plugins/reverse-engineering/skills/memory-forensics]`
- **memory-safety-patterns** — Implement memory-safe programming with RAII, ownership, smart pointers, and resource management across Rust, C++, and C. Use when writing safe systems code, managing resources, or preventing memory bugs. --- # Memory Saf  `[agents/plugins/systems-programming/skills/memory-safety-patterns]`
- **microservices-patterns** — Design microservices architectures with service boundaries, event-driven communication, and resilience patterns. Use when building distributed systems, decomposing monoliths, or implementing microservices. --- # Microser  `[agents/plugins/backend-development/skills/microservices-patterns]`
- **ml-pipeline-workflow** — Build end-to-end MLOps pipelines from data preparation through model training, validation, and production deployment. Use when creating ML pipelines, implementing MLOps practices, or automating model training and deploym  `[agents/plugins/machine-learning-ops/skills/ml-pipeline-workflow]`
- **mobile-android-design** — Master Material Design 3 and Jetpack Compose patterns for building native Android apps. Use when designing Android interfaces, implementing Compose UI, or following Google's Material Design guidelines. --- # Android Mobi  `[agents/plugins/ui-design/skills/mobile-android-design]`
- **mobile-ios-design** — Master iOS Human Interface Guidelines and SwiftUI patterns for building native iOS apps. Use when designing iOS interfaces, implementing SwiftUI views, or ensuring apps follow Apple's design principles. --- # iOS Mobile   `[agents/plugins/ui-design/skills/mobile-ios-design]`
- **modern-javascript-patterns** — Master ES6+ features including async/await, destructuring, spread operators, arrow functions, promises, modules, iterators, generators, and functional programming patterns for writing clean, efficient JavaScript code. Us  `[agents/plugins/javascript-typescript/skills/modern-javascript-patterns]`
- **monorepo-management** — Master monorepo management with Turborepo, Nx, and pnpm workspaces to build efficient, scalable multi-package repositories with optimized builds and dependency management. Use when setting up monorepos, optimizing builds  `[agents/plugins/developer-essentials/skills/monorepo-management]`
- **mtls-configuration** — Configure mutual TLS (mTLS) for zero-trust service-to-service communication. Use when implementing zero-trust networking, certificate management, or securing internal service communication. --- # mTLS Configuration Compr  `[agents/plugins/cloud-infrastructure/skills/mtls-configuration]`
- **multi-cloud-architecture** — Design multi-cloud architectures using a decision framework to select and integrate services across AWS, Azure, GCP, and OCI. Use when building multi-cloud systems, avoiding vendor lock-in, or leveraging best-of-breed se  `[agents/plugins/cloud-infrastructure/skills/multi-cloud-architecture]`
- **multi-reviewer-patterns** — Coordinate parallel code reviews across multiple quality dimensions with finding deduplication, severity calibration, and consolidated reporting. Use this skill when organizing multi-reviewer code reviews, calibrating fi  `[agents/plugins/agent-teams/skills/multi-reviewer-patterns]`
- **nextjs-app-router-patterns** — Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and advanced data fetching. Use when building Next.js applications, implementing SSR/SSG, or optimizing React Server Components. --- # Nex  `[agents/plugins/frontend-mobile-development/skills/nextjs-app-router-patterns]`
- **nft-standards** — Implement NFT standards (ERC-721, ERC-1155) with proper metadata handling, minting strategies, and marketplace integration. Use when creating NFT contracts, building NFT marketplaces, or implementing digital asset system  `[agents/plugins/blockchain-web3/skills/nft-standards]`
- **nodejs-backend-patterns** — Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js serve  `[agents/plugins/javascript-typescript/skills/nodejs-backend-patterns]`
- **nx-workspace-patterns** — Configure and optimize Nx monorepo workspaces. Use when setting up Nx, configuring project boundaries, optimizing build caching, or implementing affected commands. --- # Nx Workspace Patterns Production patterns for Nx m  `[agents/plugins/developer-essentials/skills/nx-workspace-patterns]`
- **on-call-handoff-patterns** — Master on-call shift handoffs with context transfer, escalation procedures, and documentation. Use this skill when transitioning on-call responsibilities between engineers and ensuring the incoming responder has full sit  `[agents/plugins/incident-response/skills/on-call-handoff-patterns]`
- **openapi-spec-generation** — Generate and maintain OpenAPI 3.1 specifications from code, design-first specs, and validation patterns. Use when creating API documentation, generating SDKs, or ensuring API contract compliance. --- # OpenAPI Spec Gener  `[agents/plugins/documentation-generation/skills/openapi-spec-generation]`
- **parallel-debugging** — Debug complex issues using competing hypotheses with parallel investigation, evidence collection, and root cause arbitration. Use this skill when debugging bugs with multiple potential causes, performing root cause analy  `[agents/plugins/agent-teams/skills/parallel-debugging]`
- **parallel-feature-development** — Coordinate parallel feature development with file ownership strategies, conflict avoidance rules, and integration patterns for multi-agent implementation. Use this skill when decomposing a large feature into independent   `[agents/plugins/agent-teams/skills/parallel-feature-development]`
- **paypal-integration** — Integrate PayPal payment processing with support for express checkout, subscriptions, and refund management. Use when implementing PayPal payments, processing online transactions, or building e-commerce checkout flows. -  `[agents/plugins/payment-processing/skills/paypal-integration]`
- **pci-compliance** — Implement PCI DSS compliance requirements for secure handling of payment card data and payment systems. Use when securing payment processing, achieving PCI compliance, or implementing payment card security measures. ---   `[agents/plugins/payment-processing/skills/pci-compliance]`
- **postgresql-table-design** — Use this skill when designing or reviewing a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features --- # PostgreSQL Table Design ## When to Use   `[agents/plugins/database-design/skills/postgresql-table-design]`
- **postmortem-writing** — Write effective blameless postmortems with root cause analysis, timelines, and action items. Use when conducting incident reviews, writing postmortem documents, or improving incident response processes. --- # Postmortem   `[agents/plugins/incident-response/skills/postmortem-writing]`
- **pptx-deck-context** — Use when preparing the narrative, sources, and design context for a new editable PPTX deck." --- # PPTX Deck Context Prepare the deck before coordinates or PPTX objects are authored. This skill owns the business narrativ  `[agents/plugins/pptx-deck-creation/skills/pptx-deck-context]`
- **pptx-quality-gates** — Use when validating or repairing an editable PPTX deck for geometry, accessibility, native editability, source lineage, and OOXML package integrity." --- # PPTX Quality Gates Use this skill before delivering a generated   `[agents/plugins/pptx-deck-creation/skills/pptx-quality-gates]`
- **pptx-reference-deck-analysis** — Use when analyzing a reference PPTX for read-only structure, theme, typography, layout rhythm, diagnostics, derived template catalogs, or safe OOXML package inspection." --- # PPTX Reference Deck Analysis Inspect a refer  `[agents/plugins/pptx-deck-creation/skills/pptx-reference-deck-analysis]`
- **pptx-slide-specification** — Use when authoring or repairing a coordinate-explicit JSON specification for an editable PPTX deck." --- # PPTX Slide Specification Author final coordinates directly in `layout_tree`. No renderer may decide placement, sh  `[agents/plugins/pptx-deck-creation/skills/pptx-slide-specification]`
- **pptx-visual-assets** — Use when selecting and placing approved supporting icons, images, SVGs, diagrams, or infographics in an editable PPTX deck." --- # PPTX Visual Assets Use visual assets to support a slide's message, never to flatten or re  `[agents/plugins/pptx-deck-creation/skills/pptx-visual-assets]`
- **preference-optimization** — Align a fine-tuned model with preference data using DPO, ORPO, KTO, or SimPO. Use when preference pairs or thumbs-up/down feedback exist, when choosing between preference-optimization methods, or when a DPO run needs hyp  `[agents/plugins/llm-finetuning/skills/preference-optimization]`
- **projection-patterns** — Build read models and projections from event streams. Use when implementing CQRS read sides, building materialized views, or optimizing query performance in event-sourced systems. --- # Projection Patterns Comprehensive   `[agents/plugins/backend-development/skills/projection-patterns]`
- **prometheus-configuration** — Set up Prometheus for comprehensive metric collection, storage, and monitoring of infrastructure and applications. Use when implementing metrics collection, setting up monitoring infrastructure, or configuring alerting s  `[agents/plugins/observability-monitoring/skills/prometheus-configuration]`
- **prompt-engineering-patterns** — >- This skill should be used when the user asks to "optimize a prompt", "improve prompt performance", "design a prompt template", "write better prompts", "debug prompt issues", "use chain-of-thought", "structured prompti  `[agents/plugins/llm-application-dev/skills/prompt-engineering-patterns]`
- **protect-mcp-setup** — Configure Cedar policy enforcement and Ed25519 signed receipts for Claude Code tool calls. Use when setting up projects that need cryptographic audit trails, policy-gated tool execution, or compliance-ready evidence of a  `[agents/plugins/protect-mcp/skills/protect-mcp-setup]`
- **protocol-reverse-engineering** — Master network protocol reverse engineering including packet analysis, protocol dissection, and custom protocol documentation. Use when analyzing network traffic, understanding proprietary protocols, or debugging network  `[agents/plugins/reverse-engineering/skills/protocol-reverse-engineering]`
- **python-anti-patterns** — Use this skill when reviewing Python code for common anti-patterns to avoid. Use as a checklist when reviewing code, before finalizing implementations, or when debugging issues that might stem from known bad practices. -  `[agents/plugins/python-development/skills/python-anti-patterns]`
- **python-background-jobs** — Python background job patterns including task queues, workers, and event-driven architecture. Use when implementing async task processing, job queues, long-running operations, or decoupling work from request/response cyc  `[agents/plugins/python-development/skills/python-background-jobs]`
- **python-code-style** — Python code style, linting, formatting, naming conventions, and documentation standards. Use when writing new code, reviewing style, configuring linters, writing docstrings, or establishing project standards. --- # Pytho  `[agents/plugins/python-development/skills/python-code-style]`
- **python-configuration** — Python configuration management via environment variables and typed settings. Use when externalizing config, setting up pydantic-settings, managing secrets, or implementing environment-specific behavior. --- # Python Con  `[agents/plugins/python-development/skills/python-configuration]`
- **python-design-patterns** — Python design patterns including KISS, Separation of Concerns, Single Responsibility, and composition over inheritance. Use this skill when designing a new service or component from scratch and choosing how to layer resp  `[agents/plugins/python-development/skills/python-design-patterns]`
- **python-error-handling** — Python error handling patterns including input validation, exception hierarchies, and partial failure handling. Use when implementing validation logic, designing exception strategies, handling batch processing failures,   `[agents/plugins/python-development/skills/python-error-handling]`
- **python-observability** — Python observability patterns including structured logging, metrics, and distributed tracing. Use when adding logging, implementing metrics collection, setting up tracing, or debugging production systems. --- # Python Ob  `[agents/plugins/python-development/skills/python-observability]`
- **python-packaging** — Create distributable Python packages with proper project structure, setup.py/pyproject.toml, and publishing to PyPI. Use when packaging Python libraries, creating CLI tools, or distributing Python code. --- # Python Pack  `[agents/plugins/python-development/skills/python-packaging]`
- **python-performance-optimization** — Profile and optimize Python code using cProfile, memory profilers, and performance best practices. Use when debugging slow Python code, optimizing bottlenecks, or improving application performance. --- # Python Performan  `[agents/plugins/python-development/skills/python-performance-optimization]`
- **python-project-structure** — Python project organization, module architecture, and public API design. Use when setting up new projects, organizing modules, defining public interfaces with __all__, or planning directory layouts. --- # Python Project   `[agents/plugins/python-development/skills/python-project-structure]`
- **python-resilience** — Python resilience patterns including automatic retries, exponential backoff, timeouts, and fault-tolerant decorators. Use when adding retry logic, implementing timeouts, building fault-tolerant services, or handling tran  `[agents/plugins/python-development/skills/python-resilience]`
- **python-resource-management** — Python resource management with context managers, cleanup patterns, and streaming. Use when managing connections, file handles, implementing cleanup logic, or building streaming responses with accumulated state. --- # Py  `[agents/plugins/python-development/skills/python-resource-management]`
- **python-testing-patterns** — Implement comprehensive testing strategies with pytest, fixtures, mocking, and test-driven development. Use when writing Python tests, setting up test suites, or implementing testing best practices. --- # Python Testing   `[agents/plugins/python-development/skills/python-testing-patterns]`
- **python-type-safety** — Python type safety with type hints, generics, protocols, and strict type checking. Use when adding type annotations, implementing generic classes, defining structural interfaces, or configuring mypy/pyright. --- # Python  `[agents/plugins/python-development/skills/python-type-safety]`
- **quantized-export** — Export a promoted fine-tuned model in the right deployment format — merged safetensors, LoRA-only, GGUF with imatrix, or FP8. Use after a checkpoint passes promotion, when choosing a quantization format for a target devi  `[agents/plugins/llm-finetuning/skills/quantized-export]`
- **rag-implementation** — Build Retrieval-Augmented Generation (RAG) systems for LLM applications with vector databases and semantic search. Use when implementing knowledge-grounded AI, building document Q&A systems, or integrating LLMs with exte  `[agents/plugins/llm-application-dev/skills/rag-implementation]`
- **react-modernization** — Upgrade React applications to latest versions, migrate from class components to hooks, and adopt concurrent features. Use when modernizing React codebases, migrating to React Hooks, or upgrading to latest React versions.  `[agents/plugins/framework-migration/skills/react-modernization]`
- **react-native-architecture** — Build production React Native apps with Expo, navigation, native modules, offline sync, and cross-platform patterns. Use when developing mobile apps, implementing native integrations, or architecting React Native project  `[agents/plugins/frontend-mobile-development/skills/react-native-architecture]`
- **react-native-design** — Master React Native styling, navigation, and Reanimated animations for cross-platform mobile development. Use when building React Native apps, implementing navigation patterns, or creating performant animations. --- # Re  `[agents/plugins/ui-design/skills/react-native-design]`
- **react-state-management** — Master modern React state management with Redux Toolkit, Zustand, Jotai, and React Query. Use when setting up global state, managing server state, or choosing between state management solutions. --- # React State Managem  `[agents/plugins/frontend-mobile-development/skills/react-state-management]`
- **recsys-pipeline-architect** — Design composable recommendation, ranking, and feed pipelines using the six-stage Source→Hydrator→Filter→Scorer→Selector→SideEffect framework popularized by xAI's open-sourced X For You algorithm. Use when building any s  `[agents/plugins/machine-learning-ops/skills/recsys-pipeline-architect]`
- **responsive-design** — Implement modern responsive layouts using container queries, fluid typography, CSS Grid, and mobile-first breakpoint strategies. Use when building adaptive interfaces, implementing fluid layouts, or creating component-le  `[agents/plugins/ui-design/skills/responsive-design]`
- **review-agent-setup** — Configure human-in-the-loop gating for AI agent review actions in Claude Code. Use when setting up a project where an agent may post PR reviews, comments, merges, or edit CI configuration, and you want a cryptographicall  `[agents/plugins/review-agent-governance/skills/review-agent-setup]`
- **risk-metrics-calculation** — Calculate portfolio risk metrics including VaR, CVaR, Sharpe, Sortino, and drawdown analysis. Use when measuring portfolio risk, implementing risk limits, or building risk monitoring systems. --- # Risk Metrics Calculati  `[agents/plugins/quantitative-trading/skills/risk-metrics-calculation]`
- **rust-async-patterns** — Master Rust async programming with Tokio, async traits, error handling, and concurrent patterns. Use when building async Rust applications, implementing concurrent systems, or debugging async code. --- # Rust Async Patte  `[agents/plugins/systems-programming/skills/rust-async-patterns]`
- **saga-orchestration** — Implement saga patterns for distributed transactions and cross-aggregate workflows. Use this skill when implementing distributed transactions across microservices where 2PC is unavailable, designing compensating actions   `[agents/plugins/backend-development/skills/saga-orchestration]`
- **sast-configuration** — Configure Static Application Security Testing (SAST) tools for automated vulnerability detection in application code. Use when setting up security scanning, implementing DevSecOps practices, or automating code vulnerabil  `[agents/plugins/security-scanning/skills/sast-configuration]`
- **scan** — Scans the codebase to generate project-doc.md and AGENTS.md. Use when bootstrapping a new agent-driven repo, refreshing project documentation after architectural changes, or running a delta scan to detect drift. Runs a f  `[agents/plugins/ship-mate/skills/scan]`
- **screen-reader-testing** — Test web applications with screen readers including VoiceOver, NVDA, and JAWS. Use when validating screen reader compatibility, debugging accessibility issues, or ensuring assistive technology support. --- # Screen Reade  `[agents/plugins/accessibility-compliance/skills/screen-reader-testing]`
- **secrets-management** — Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. Use when handling sensitive credentials, rotating secrets, or securing CI/CD environments. --- # Sec  `[agents/plugins/cicd-automation/skills/secrets-management]`
- **security-requirement-extraction** — Derive security requirements from threat models and business context. Use when translating threats into actionable requirements, creating security user stories, or building security test cases. --- # Security Requirement  `[agents/plugins/security-scanning/skills/security-requirement-extraction]`
- **service-mesh-observability** — Implement comprehensive observability for service meshes including distributed tracing, metrics, and visualization. Use when setting up mesh monitoring, debugging latency issues, or implementing SLOs for service communic  `[agents/plugins/cloud-infrastructure/skills/service-mesh-observability]`
- **session-guard** — >- Use when working on complex multi-step tasks, when a session is getting long (40+ tool calls), when the agent starts ignoring rules it followed earlier, when conventions drift, when output quality seems to degrade, or  `[agents/plugins/skill-forge-essentials/skills/session-guard]`
- **shellcheck-configuration** — Master ShellCheck static analysis configuration and usage for shell script quality. Use when setting up linting infrastructure, fixing code issues, or ensuring script portability. --- # ShellCheck Configuration and Stati  `[agents/plugins/shell-scripting/skills/shellcheck-configuration]`
- **signed-audit-trails-recipe** — Step-by-step cookbook for setting up cryptographically signed audit trails on Claude Code tool calls. Use when explaining, evaluating, or demonstrating the pattern before committing to the protect-mcp runtime hooks. Cove  `[agents/plugins/signed-audit-trails/skills/signed-audit-trails-recipe]`
- **similarity-search-patterns** — Implement efficient similarity search with vector databases. Use when building semantic search, implementing nearest neighbor queries, or optimizing retrieval performance. --- # Similarity Search Patterns Patterns for im  `[agents/plugins/llm-application-dev/skills/similarity-search-patterns]`
- **slo-implementation** — Define and implement Service Level Indicators (SLIs) and Service Level Objectives (SLOs) with error budgets and alerting. Use when establishing reliability targets, implementing SRE practices, or measuring service perfor  `[agents/plugins/observability-monitoring/skills/slo-implementation]`
- **social-evidence-research** — Research public discussion on social platforms and keep every report claim tied to the source material that supports it. Use when researching or comparing how a product, event, or topic is discussed across social platfor  `[agents/plugins/content-marketing/skills/social-evidence-research]`
- **social-publishing** — > Schedule and publish social media posts across 13 platforms (X, LinkedIn, Instagram, Facebook Pages, TikTok, Discord, Telegram, YouTube, Reddit, WordPress, Pinterest) via the SocialClaw API. Use when the user wants to   `[agents/plugins/social-publishing/skills/social-publishing]`
- **solidity-security** — Master smart contract security best practices to prevent common vulnerabilities and implement secure Solidity patterns. Use when writing smart contracts, auditing existing contracts, or implementing security measures for  `[agents/plugins/blockchain-web3/skills/solidity-security]`
- **spark-environment-setup** — Set up a working ML training/inference environment on NVIDIA DGX Spark (GB10, aarch64, CUDA 13). Use when installing PyTorch/Unsloth/TRL/vLLM on DGX Spark, hitting libcudart or wheel-ABI errors on aarch64, or choosing be  `[agents/plugins/dgx-spark-ops/skills/spark-environment-setup]`
- **spark-memory-thermal-ops** — Manage unified memory and thermals during long-running ML jobs on NVIDIA DGX Spark. Use when planning memory headroom for a training run on GB10, when a job OOMs on unified memory, or when monitoring temperature and powe  `[agents/plugins/dgx-spark-ops/skills/spark-memory-thermal-ops]`
- **spark-optimization** — Optimize Apache Spark jobs with partitioning, caching, shuffle optimization, and memory tuning. Use when improving Spark performance, debugging slow jobs, or scaling data processing pipelines. --- # Apache Spark Optimiza  `[agents/plugins/data-engineering/skills/spark-optimization]`
- **spark-training-gotchas** — Preflight and diagnose the ten known failure modes for ML training on NVIDIA DGX Spark. Use when a training run on DGX Spark fails to start, OOMs below the 128GB limit, slows down mid-run, or before any multi-hour traini  `[agents/plugins/dgx-spark-ops/skills/spark-training-gotchas]`
- **sql-optimization-patterns** — Master SQL query optimization, indexing strategies, and EXPLAIN analysis to dramatically improve database performance and eliminate slow queries. Use when debugging slow queries, designing database schemas, or optimizing  `[agents/plugins/developer-essentials/skills/sql-optimization-patterns]`
- **startup-financial-modeling** — Build comprehensive 3-5 year financial models with revenue projections, cost structures, cash flow analysis, and scenario planning for early-stage startups. Use this skill when creating financial projections, calculating  `[agents/plugins/startup-business-analyst/skills/startup-financial-modeling]`
- **startup-metrics-framework** — Track, calculate, and optimize key performance metrics for SaaS, marketplace, consumer, and B2B startups from seed through Series A, including unit economics, growth efficiency, and cash management. Use this skill when d  `[agents/plugins/startup-business-analyst/skills/startup-metrics-framework]`
- **stride-analysis-patterns** — Apply STRIDE methodology to systematically identify threats. Use when analyzing system security, conducting threat modeling sessions, or creating security documentation. --- # STRIDE Analysis Patterns Systematic threat i  `[agents/plugins/security-scanning/skills/stride-analysis-patterns]`
- **stripe-integration** — Implement Stripe payment processing for robust, PCI-compliant payment flows including checkout, subscriptions, and webhooks. Use when integrating Stripe payments, building subscription systems, or implementing secure che  `[agents/plugins/payment-processing/skills/stripe-integration]`
- **superself** — 'Use when a project keeps its state in Superself (a `<!-- superself:begin` block in AGENTS.md or CLAUDE.md, or `self setup` resolves the directory to a registered project): read `self context` at session start, attach wo  `[agents/plugins/superself/skills/superself]`
- **tailwind-design-system** — Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns. --- # Tai  `[agents/plugins/frontend-mobile-development/skills/tailwind-design-system]`
- **task-coordination-strategies** — Decompose complex tasks, design dependency graphs, and coordinate multi-agent work with proper task descriptions and workload balancing. Use this skill when breaking down work for agent teams, managing task dependencies,  `[agents/plugins/agent-teams/skills/task-coordination-strategies]`
- **team-communication-protocols** — Structured messaging protocols for agent team communication including message type selection, plan approval, shutdown procedures, and anti-patterns to avoid. Use this skill when establishing communication norms for a new  `[agents/plugins/agent-teams/skills/team-communication-protocols]`
- **team-composition-analysis** — Design optimal team structures, hiring plans, compensation strategies, and equity allocation for early-stage startups from pre-seed through Series A. Use this skill when planning headcount, determining which roles to hir  `[agents/plugins/startup-business-analyst/skills/team-composition-analysis]`
- **team-composition-patterns** — Design optimal agent team compositions with sizing heuristics, preset configurations, and agent type selection. Use this skill when deciding how many agents to spawn for a task, when choosing between a review team versus  `[agents/plugins/agent-teams/skills/team-composition-patterns]`
- **temporal-python-testing** — Test Temporal workflows with pytest, time-skipping, and mocking strategies. Covers unit testing, integration testing, replay testing, and local development setup. Use when implementing Temporal workflow tests or debuggin  `[agents/plugins/backend-development/skills/temporal-python-testing]`
- **terraform-module-library** — Build reusable Terraform modules for AWS, Azure, GCP, and OCI infrastructure following infrastructure-as-code best practices. Use when creating infrastructure modules, standardizing cloud provisioning, or implementing re  `[agents/plugins/cloud-infrastructure/skills/terraform-module-library]`
- **threat-mitigation-mapping** — Map identified threats to appropriate security controls and mitigations. Use when prioritizing security investments, creating remediation plans, or validating control effectiveness. --- # Threat Mitigation Mapping Connec  `[agents/plugins/security-scanning/skills/threat-mitigation-mapping]`
- **trace-to-training-data** — Convert evaluation traces and production logs into SFT examples and preference pairs. Use when graded traces or failure examples exist and need to become training data, when applying rejection sampling to model outputs,   `[agents/plugins/llm-finetuning/skills/trace-to-training-data]`
- **track-management** — Use this skill when creating, managing, or working with Conductor tracks - the logical work units for features, bugs, and refactors. Applies to spec.md, plan.md, and track lifecycle operations. version: 1.0.0 --- # Track  `[agents/plugins/conductor/skills/track-management]`
- **turborepo-caching** — Configure Turborepo for efficient monorepo builds with local and remote caching. Use when setting up Turborepo, optimizing build pipelines, or implementing distributed caching. --- # Turborepo Caching Production patterns  `[agents/plugins/developer-essentials/skills/turborepo-caching]`
- **typescript-advanced-types** — Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating r  `[agents/plugins/javascript-typescript/skills/typescript-advanced-types]`
- **unity-ecs-patterns** — Master Unity ECS (Entity Component System) with DOTS, Jobs, and Burst for high-performance game development. Use when building data-oriented games, optimizing performance, or working with large entity counts. --- # Unity  `[agents/plugins/game-development/skills/unity-ecs-patterns]`
- **uv-package-manager** — Master the uv package manager for fast Python dependency management, virtual environments, and modern Python project workflows. Use when setting up Python projects, managing dependencies, or optimizing Python development  `[agents/plugins/python-development/skills/uv-package-manager]`
- **vector-index-tuning** — Optimize vector index performance for latency, recall, and memory. Use when tuning HNSW parameters, selecting quantization strategies, or scaling vector search infrastructure. --- # Vector Index Tuning Guide to optimizin  `[agents/plugins/llm-application-dev/skills/vector-index-tuning]`
- **vision-sft** — Fine-tune vision-language models (VLMs) with supervised learning on image+text data. Use when adapting a VLM to a visual domain or task, configuring frozen-vision-tower LoRA, or debugging a VLM fine-tune that trains with  `[agents/plugins/llm-finetuning/skills/vision-sft]`
- **visual-design-foundations** — Apply typography, color theory, spacing systems, and iconography principles to create cohesive visual designs. Use when establishing design tokens, building style guides, or improving visual hierarchy and consistency. --  `[agents/plugins/ui-design/skills/visual-design-foundations]`
- **visual-edit-precision** — >- Use when making UI/frontend changes guided by visual context, when the user selects elements visually, draws annotations, or provides screenshots alongside change requests. Also use when editing components where spati  `[agents/plugins/skill-forge-essentials/skills/visual-edit-precision]`
- **wcag-audit-patterns** — Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance. Use when auditing websites for accessibility, fixing WCAG violations, or implementing accessible design pattern  `[agents/plugins/accessibility-compliance/skills/wcag-audit-patterns]`
- **web-component-design** — Master React, Vue, and Svelte component patterns including CSS-in-JS, composition strategies, and reusable component architecture. Use when building UI component libraries, designing component APIs, or implementing front  `[agents/plugins/ui-design/skills/web-component-design]`
- **web3-testing** — Test smart contracts comprehensively using Hardhat and Foundry with unit tests, integration tests, and mainnet forking. Use when testing Solidity contracts, setting up blockchain test suites, or validating DeFi protocols  `[agents/plugins/blockchain-web3/skills/web3-testing]`
- **workflow-orchestration-patterns** — Design durable workflows with Temporal for distributed systems. Covers workflow vs activity separation, saga patterns, state management, and determinism constraints. Use when building long-running processes, distributed   `[agents/plugins/backend-development/skills/workflow-orchestration-patterns]`
- **workflow-patterns** — Use this skill when implementing tasks according to Conductor's TDD workflow, handling phase checkpoints, managing git commits for tasks, or understanding the verification protocol. version: 1.0.0 --- # Workflow Patterns  `[agents/plugins/conductor/skills/workflow-patterns]`

## knowledge-work-plugins — 252 skill
https://github.com/anthropics/knowledge-work-plugins — Plugin resmi Anthropic untuk knowledge work

- **accessibility-review** — Run a WCAG 2.1 AA accessibility audit on a design or page. Trigger with "audit accessibility", "check a11y", "is this accessible?", or when reviewing a design for color contrast, keyboard navigation, touch target size, o  `[knowledge-work-plugins/design/skills/accessibility-review]`
- **account-context** — 360-degree view of an account - CRM data, recent email threads, docs, transcripts, and internal chat chatter, synthesized into one brief. Use when the user asks "tell me about [account]" (an existing customer; for a pros  `[knowledge-work-plugins/sales/skills/account-context]`
- **account-plan** — Build or refresh a strategic account plan - current state, goals, stakeholder coverage, opportunity map, risks, and the action plan - written to a doc and key fields synced to the CRM. Use when the user says "build an ac  `[knowledge-work-plugins/sales/skills/account-plan]`
- **account-research** — Research a company using Common Room data. Triggers on 'research [company]', 'tell me about [domain]', 'pull up signals for [account]', 'what's going on with [company]', or any account-level question." --- # Account Rese  `[knowledge-work-plugins/partner-built/common-room/skills/account-research]`
- **account-research** — Research a target company and optionally a specific contact - company overview, recent news, likely priorities, and fit against your ICP. Cross-references existing CRM records. Use when the user asks to "research [compan  `[knowledge-work-plugins/sales/skills/account-research]`
- **account-tiering** — Score and tier a list of accounts (or your full book) against ICP fit and engagement signals to prioritize where to spend time. Use when the user asks to "tier my accounts", "prioritize my book", "which accounts should I  `[knowledge-work-plugins/sales/skills/account-tiering]`
- **ad-manager** — > The ads consultant that becomes an ads agent. Reads paid-ad performance natively through the TikTok Ads connector, or via a build-connector Zapier connection for other ad platforms, explains in plain English what is wo  `[knowledge-work-plugins/small-business/skills/ad-manager]`
- **analyze** — Answer data questions -- from quick lookups to full analyses. Use when looking up a single metric, investigating what's driving a trend or drop, comparing segments over time, or preparing a formal data report for stakeho  `[knowledge-work-plugins/data/skills/analyze]`
- **ap-processor** — > Works the bill pile end to end: reads bills and vendor statements out of the AP inbox or from uploaded PDFs and phone photos, pulls out vendor, amount, due date, and line detail, codes each one to the right account and  `[knowledge-work-plugins/small-business/skills/ap-processor]`
- **architecture** — Create or evaluate an architecture decision record (ADR). Use when choosing between technologies (e.g., Kafka vs SQS), documenting a design decision with trade-offs and consequences, reviewing a system design proposal, o  `[knowledge-work-plugins/engineering/skills/architecture]`
- **audit-support** — Support SOX 404 compliance with control testing methodology, sample selection, and documentation standards. Use when generating testing workpapers, selecting audit samples, classifying control deficiencies, or preparing   `[knowledge-work-plugins/finance/skills/audit-support]`
- **brand-review** — Review content against your brand voice, style guide, and messaging pillars, flagging deviations by severity with specific before/after fixes. Use when checking a draft before it ships, when auditing copy for voice consi  `[knowledge-work-plugins/marketing/skills/brand-review]`
- **brand-style** — > Sets and updates the owner's brand look and output preferences, which every page and document the plugin produces then follows automatically. Captures the brand from a pasted website link or a plain-words description —  `[knowledge-work-plugins/small-business/skills/brand-style]`
- **brand-voice-enforcement** — > This skill applies brand guidelines to content creation. It should be used when the user asks to "write an email", "draft a proposal", "create a pitch deck", "write a LinkedIn post", "draft a presentation", "write a Sl  `[knowledge-work-plugins/partner-built/brand-voice/skills/brand-voice-enforcement]`
- **brief** — Generate contextual briefings for legal work — daily summary, topic research, or incident response. Use when starting your day and need a scan of legal-relevant items across email, calendar, and contracts, when researchi  `[knowledge-work-plugins/legal/skills/brief]`
- **build-agent** — > Turns a task the owner keeps doing by hand into a named, reusable skill they can trigger by name or put on a schedule. Watches them do it once or listens to them describe it, works out what varies and what stays fixed,  `[knowledge-work-plugins/small-business/skills/build-agent]`
- **build-connector** — > Gets Claude talking to a tool nobody built an official connector for. Works out what the system is, checks the Claude connector directory for an existing connector first, and when there isn't one connects the tool thro  `[knowledge-work-plugins/small-business/skills/build-connector]`
- **build-dashboard** — Build an interactive HTML dashboard with charts, filters, and tables. Use when creating an executive overview with KPI cards, turning query results into a shareable self-contained report, building a team monitoring snaps  `[knowledge-work-plugins/data/skills/build-dashboard]`
- **build-zoom-bot** — Build a Zoom meeting bot, recorder, or real-time media workflow. Use when joining meetings programmatically, processing live media or transcripts, or combining Meeting SDK, RTMS, and backend services. --- # /build-zoom-b  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/build-zoom-bot]`
- **build-zoom-contact-center-app** — Reference skill for Zoom Contact Center. Use after routing to a contact-center workflow when implementing app, web, or native integrations; engagement context and state handling; campaigns; callbacks; or version-drift tr  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/contact-center]`
- **build-zoom-meeting-app** — Build or embed a Zoom meeting flow. Use when implementing Meeting SDK joins, web or mobile meeting embeds, meeting lifecycle flows, or when deciding between Meeting SDK and Video SDK. --- # /build-zoom-meeting-app Use th  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/build-zoom-meeting-app]`
- **build-zoom-meeting-sdk-app** — Reference skill for Zoom Meeting SDK. Use after routing to a meeting-embed workflow when implementing real Zoom meeting joins, platform-specific SDK behavior, auth and join flows, waiting room issues, or meeting bot patt  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk]`
- **build-zoom-phone-integration** — Reference skill for Zoom Phone. Use after routing to a phone workflow when implementing OAuth, Phone APIs, webhooks, Smart Embed events, URI schemes, CRM or CTI dialers, or call handling automation." triggers: - "zoom ph  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/phone]`
- **build-zoom-rest-api-app** — Reference skill for Zoom REST API. Use after choosing an API-based workflow when you need endpoint selection, resource-management patterns, OAuth requirements, rate-limit awareness, or API error debugging." triggers: - "  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/rest-api]`
- **build-zoom-team-chat-app** — Reference skill for Zoom Team Chat. Use after routing to a chat workflow when building user-scoped messaging integrations, chatbot experiences, rich cards, buttons, slash commands, or chat webhooks." triggers: - "zoom te  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/team-chat]`
- **build-zoom-video-sdk-app** — Reference skill for Zoom Video SDK. Use after routing to a custom-session workflow when the user needs full control over the video experience rather than an actual Zoom meeting. triggers: - "custom video" - "video sdk" -  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk]`
- **build-zoom-virtual-agent** — Reference skill for Zoom Virtual Agent. Use after routing to a virtual-agent workflow when implementing web embeds, Android or iOS wrapper integrations, knowledge-base sync, lifecycle handling, or troubleshooting." trigg  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/virtual-agent]`
- **business-pulse** — > Produces a one-page cross-functional business snapshot for SMB owners — cash position (the ledger: MYOB, NetSuite, QuickBooks, Xero, or Zoho Books), sales trend (PayPal/Square/Stripe), pipeline movement (HubSpot), this  `[knowledge-work-plugins/small-business/skills/business-pulse]`
- **call-list** — Builds today's call list. Runs lead-triage to rank the top-5 leads most worth calling, supplies talking points from email history, blocks time on the calendar, and drafts follow-up messages. Trigger on "call list," "who   `[knowledge-work-plugins/small-business/skills/call-list]`
- **call-prep** — Prepare for a customer or prospect call using Common Room signals. Triggers on 'prep me for my call with [company]', 'prepare for a meeting with [company]', 'what should I know before talking to [company]', or any call p  `[knowledge-work-plugins/partner-built/common-room/skills/call-prep]`
- **call-prep** — Pre-call brief for an upcoming meeting - attendees, account history, prior call context from transcripts, open opportunity status, and suggested discovery questions. Use when the user asks "prep me for [meeting/company]"  `[knowledge-work-plugins/sales/skills/call-prep]`
- **call-summary** — Turn a call transcript or call notes into a customer follow-up email draft, an internal chat summary, and proposed CRM updates. Use when the user says "call summary", "follow up on my [company] call", "summarize my call   `[knowledge-work-plugins/sales/skills/call-summary]`
- **campaign-plan** — Generate a full campaign brief with objectives, audience, messaging, channel strategy, content calendar, and success metrics. Use when planning a product launch, lead-gen push, or awareness campaign, when you need a week  `[knowledge-work-plugins/marketing/skills/campaign-plan]`
- **canva-creator** — > Takes an approved content brief and executes a campaign end-to-end: builds the posting calendar, generates Canva designs for social posts, drafts caption and email copy, and stages social sends in HubSpot. Canva is use  `[knowledge-work-plugins/small-business/skills/canva-creator]`
- **capacity-plan** — Plan resource capacity — workload analysis and utilization forecasting. Use when heading into quarterly planning, the team feels overallocated and you need the numbers, deciding whether to hire or deprioritize, or stress  `[knowledge-work-plugins/operations/skills/capacity-plan]`
- **cash-flow-snapshot** — > Reads AR/AP, historical cash timing, and known fixed costs from the ledger (MYOB, NetSuite, QuickBooks, Xero, or Zoho Books) or from PayPal, Square, or Stripe — or a CSV upload — and produces a 30/60/90-day cash flow f  `[knowledge-work-plugins/small-business/skills/cash-flow-snapshot]`
- **change-request** — Create a change management request with impact analysis and rollback plan. Use when proposing a system or process change that needs approval, preparing a change record for CAB review, documenting risk and rollback steps   `[knowledge-work-plugins/operations/skills/change-request]`
- **choose-zoom-approach** — Choose the right Zoom architecture for a use case. Use when deciding between REST API, Webhooks, WebSockets, Meeting SDK, Video SDK, Zoom Apps SDK, Zoom MCP, Phone, Contact Center, or a hybrid approach. user-invocable: f  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/choose-zoom-approach]`
- **close-management** — Manage the month-end close process with task sequencing, dependencies, and status tracking. Use when planning the close calendar, tracking close progress, identifying blockers, or sequencing close activities by day. user  `[knowledge-work-plugins/finance/skills/close-management]`
- **close-month** — Closes the books and turns them into a decision as a three-link chain — month-end-prep reconciles the ledger against every connected payment processor and writes the P&L narrative, cash-flow-snapshot then refreshes the 3  `[knowledge-work-plugins/small-business/skills/close-month]`
- **close-plan** — Build the business case and mutual action plan for a deal - the why-buy/why-now story, the ROI framing, and the dated step-by-step path to signature shared with the customer. Use when the user says "build a close plan fo  `[knowledge-work-plugins/sales/skills/close-plan]`
- **code-review** — Review code changes for security, performance, and correctness. Trigger with a PR URL or diff, "review this before I merge", "is this code safe?", or when checking a change for N+1 queries, injection risks, missing edge   `[knowledge-work-plugins/engineering/skills/code-review]`
- **comp-analysis** — Analyze compensation — benchmarking, band placement, and equity modeling. Trigger with "what should we pay a [role]", "is this offer competitive", "model this equity grant", or when uploading comp data to find outliers a  `[knowledge-work-plugins/human-resources/skills/comp-analysis]`
- **competitive-brief** — Research competitors and generate a positioning and messaging comparison with content gaps, opportunities, and threats. Use when building sales battlecards, when finding positioning gaps and messaging angles competitors   `[knowledge-work-plugins/marketing/skills/competitive-brief]`
- **competitive-brief** — Create a competitive analysis brief for one or more competitors or a feature area. Use when informing product strategy or feature prioritization, building sales battle cards, prepping board or investor materials, or deci  `[knowledge-work-plugins/product-management/skills/competitive-brief]`
- **competitive-intelligence** — Competitive analysis two ways - the in-deal play against a named competitor, and win/loss patterns, competitor mentions, and battlecards across the book. Use when the user asks "competitive intel", "research competitors"  `[knowledge-work-plugins/sales/skills/competitive-intelligence]`
- **compliance-check** — Run a compliance check on a proposed action, product feature, or business initiative, surfacing applicable regulations, required approvals, and risk areas. Use when launching a feature that touches personal data, when ma  `[knowledge-work-plugins/legal/skills/compliance-check]`
- **compliance-tracking** — Track compliance requirements and audit readiness. Trigger with "compliance", "audit prep", "SOC 2", "ISO 27001", "GDPR", "regulatory requirement", or when the user needs help tracking, preparing for, or documenting comp  `[knowledge-work-plugins/operations/skills/compliance-tracking]`
- **compose-outreach** — Generate personalized outreach messages using Common Room signals. Triggers on 'draft outreach to [person]', 'write an email to [name]', 'compose a message for [contact]', or any outreach drafting request." --- # Compose  `[knowledge-work-plugins/partner-built/common-room/skills/compose-outreach]`
- **contact-center/android** — Zoom Contact Center SDK for Android. Use for native Android chat/video/ZVA/scheduled callback integrations, campaign mode, service lifecycle, and rejoin handling." user-invocable: false triggers: - "contact center androi  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/contact-center/android]`
- **contact-center/ios** — Zoom Contact Center SDK for iOS. Use for native iOS chat/video/ZVA/scheduled callback integrations, app lifecycle bridging, rejoin flow, and callback handling." user-invocable: false triggers: - "contact center ios" - "z  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/contact-center/ios]`
- **contact-center/web** — Zoom Contact Center SDK for Web. Use for web chat/video/campaign embeds, engagement event handling, app-context integrations, and Smart Embed postMessage workflows." user-invocable: false triggers: - "contact center web"  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/contact-center/web]`
- **contact-research** — Research a specific person using Common Room data. Triggers on 'who is [name]', 'look up [email]', 'research [contact]', 'is [name] a warm lead', or any contact-level question." --- # Contact Research Retrieve a comprehe  `[knowledge-work-plugins/partner-built/common-room/skills/contact-research]`
- **content-creation** — Draft marketing content across channels — blog posts, social media, email newsletters, landing pages, press releases, and case studies. Use when writing any marketing content, when you need channel-specific formatting, S  `[knowledge-work-plugins/marketing/skills/content-creation]`
- **content-strategy** — > Analyzes sales data from PayPal and QuickBooks to find top performers and slow movers, layers in seasonality, and produces a prioritized 30-day content brief: what to push, what offers to run, what to hold. Strategic o  `[knowledge-work-plugins/small-business/skills/content-strategy]`
- **contract-review** — > Lightweight NDA, MSA, and vendor contract review for SMBs without legal on staff. Reads contracts from local files, mail attachments (Gmail or M365), a connected file store (Google Drive or M365), or DocuSign envelopes  `[knowledge-work-plugins/small-business/skills/contract-review]`
- **cowork-plugin-customizer** — > Customize a Claude Code plugin for a specific organization's tools and workflows. Use when: customize plugin, set up plugin, configure plugin, tailor plugin, adjust plugin settings, customize plugin connectors, customi  `[knowledge-work-plugins/cowork-plugin-management/skills/cowork-plugin-customizer]`
- **create-an-asset** — Build a customer deck, one-pager or leave-behind from your account data, call notes and approved materials, with no made-up numbers. Use when the user asks for a sales asset, one-pager, deck, leave-behind, "create an ass  `[knowledge-work-plugins/sales/skills/create-an-asset]`
- **create-cowork-plugin** — > Guide users through creating a new plugin from scratch in a cowork session. Use when users want to create a plugin, build a plugin, make a new plugin, develop a plugin, scaffold a plugin, start a plugin from scratch, o  `[knowledge-work-plugins/cowork-plugin-management/skills/create-cowork-plugin]`
- **create-viz** — Create publication-quality visualizations with Python. Use when turning query results or a DataFrame into a chart, selecting the right chart type for a trend or comparison, generating a plot for a report or presentation,  `[knowledge-work-plugins/data/skills/create-viz]`
- **crm-autopilot** — > Keeps the CRM current without the owner ever opening it. Creates and updates contacts and deals from email, calendar, and call transcripts; logs activity automatically; drafts follow-ups on deals that have gone quiet;   `[knowledge-work-plugins/small-business/skills/crm-autopilot]`
- **crm-hygiene-check** — Read-only audit of your CRM opportunities for missing fields, stale dates, and stage mismatches - outputs a fix checklist to apply by hand or through update-opportunity. Use when the user asks "check my CRM hygiene", "ch  `[knowledge-work-plugins/sales/skills/crm-hygiene-check]`
- **customer-escalation** — Package an escalation for engineering, product, or leadership with full context. Use when a bug needs engineering attention beyond normal support, multiple customers report the same issue, a customer is threatening to ch  `[knowledge-work-plugins/customer-support/skills/customer-escalation]`
- **customer-health** — Health check on a customer account and QBR-ready prep - relationship strength, engagement trend, risk signals, value delivered, and the agenda that makes the review worth their time. Use when the user asks "how healthy i  `[knowledge-work-plugins/sales/skills/customer-health]`
- **customer-research** — Multi-source research on a customer question or topic with source attribution. Use when a customer asks something you need to look up, investigating whether a bug has been reported before, checking what was previously to  `[knowledge-work-plugins/customer-support/skills/customer-research]`
- **customer-voice** — Surface what customers are actually saying - direct attributed quotes on a topic across call transcripts and email, across your accounts. Use when the user asks "what are customers saying about [topic]", "pull quotes on   `[knowledge-work-plugins/sales/skills/customer-voice]`
- **daily-briefing** — Morning rundown - today's meetings with account context, opps closing soon with stale flags, waiting customer emails, and the day's top actions. Use when the user says "daily briefing", "daily brief", "morning briefing",  `[knowledge-work-plugins/sales/skills/daily-briefing]`
- **data-context-extractor** — > Generate or improve a company-specific data analysis skill by extracting tribal knowledge from analysts. BOOTSTRAP MODE - Triggers: "Create a data context skill", "Set up data analysis for our warehouse", "Help me crea  `[knowledge-work-plugins/data/skills/data-context-extractor]`
- **data-visualization** — Create effective data visualizations with Python (matplotlib, seaborn, plotly). Use when building charts, choosing the right chart type for a dataset, creating publication-quality figures, or applying design principles l  `[knowledge-work-plugins/data/skills/data-visualization]`
- **deal-advance-gap** — Forward-looking gap check on one opportunity - exactly what is missing to advance it to the next stage and to close, with who does what by when. Use when the user asks "what's missing to advance [deal]", "what do I need   `[knowledge-work-plugins/sales/skills/deal-advance-gap]`
- **deal-review** — Deep-dive on a single opportunity - signal-adjusted health score, risks, gaps in qualification, and recommended next actions. Use when the user asks "review the [account] deal", "deal review on [opp]", "is [opp] going to  `[knowledge-work-plugins/sales/skills/deal-review]`
- **deal-signals** — Proactive watch over your book - deals gone quiet, close dates slipping into view, champion changes, renewal windows opening, competitor mentions - surfaced as a short alert digest you can act on. Use when the user asks   `[knowledge-work-plugins/sales/skills/deal-signals]`
- **deal-slip-scenario** — Model what happens to your number if a deal slips, shrinks, or dies - quota impact, coverage ratio change, and the substitute pipeline needed to stay on plan. Use when the user asks "what if [deal] slips", "what happens   `[knowledge-work-plugins/sales/skills/deal-slip-scenario]`
- **debug** — Structured debugging session — reproduce, isolate, diagnose, and fix. Trigger with an error message or stack trace, "this works in staging but not prod", "something broke after the deploy", or when behavior diverges from  `[knowledge-work-plugins/engineering/skills/debug]`
- **debug-zoom** — Debug a broken Zoom integration by isolating the failure point and routing into the right Zoom references. Use when auth, API, webhook, SDK, or MCP behavior is failing and you need a ranked hypothesis list plus verificat  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/debug-zoom]`
- **debug-zoom-integration** — Debug broken Zoom implementations quickly. Use when auth, webhooks, SDK joins, MCP transport, or real-time media workflows are failing and you need to isolate the layer before proposing a fix. user-invocable: false --- #  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/debug-zoom-integration]`
- **deploy-checklist** — Pre-deployment verification checklist. Use when about to ship a release, deploying a change with database migrations or feature flags, verifying CI status and approvals before going to production, or documenting rollback  `[knowledge-work-plugins/engineering/skills/deploy-checklist]`
- **design-critique** — Get structured design feedback on usability, hierarchy, and consistency. Trigger with "review this design", "critique this mockup", "what do you think of this screen?", or when sharing a Figma link or screenshot for feed  `[knowledge-work-plugins/design/skills/design-critique]`
- **design-handoff** — Generate developer handoff specs from a design. Use when a design is ready for engineering and needs a spec sheet covering layout, design tokens, component props, interaction states, responsive breakpoints, edge cases, a  `[knowledge-work-plugins/design/skills/design-handoff]`
- **design-mcp-workflow** — Design a Zoom MCP workflow for Claude. Use when deciding whether Zoom MCP fits a task, when planning tool-based AI workflows, or when separating MCP responsibilities from REST API responsibilities. user-invocable: false   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/design-mcp-workflow]`
- **design-system** — Audit, document, or extend your design system. Use when checking for naming inconsistencies or hardcoded values across components, writing documentation for a component's variants, states, and accessibility notes, or des  `[knowledge-work-plugins/design/skills/design-system]`
- **digest** — Generate a daily or weekly digest of activity across all connected sources. Use when catching up after time away, starting the day and wanting a summary of mentions and action items, or reviewing a week's decisions and d  `[knowledge-work-plugins/enterprise-search/skills/digest]`
- **discover-brand** — > This skill orchestrates autonomous discovery of brand materials across enterprise platforms (Notion, Confluence, Google Drive, Box, SharePoint, Figma, Gong, Granola, Slack). It should be used when the user asks to "dis  `[knowledge-work-plugins/partner-built/brand-voice/skills/discover-brand]`
- **documentation** — Write and maintain technical documentation. Trigger with "write docs for", "document this", "create a README", "write a runbook", "onboarding guide", or when the user needs help with any form of technical writing — API d  `[knowledge-work-plugins/engineering/skills/documentation]`
- **draft-content** — Draft blog posts, social media, email newsletters, landing pages, press releases, and case studies with channel-specific formatting and SEO recommendations. Use when writing any marketing content, when you need headline   `[knowledge-work-plugins/marketing/skills/draft-content]`
- **draft-offer** — Draft an offer letter with comp details and terms. Use when a candidate is ready for an offer, assembling a total comp package (base, equity, signing bonus), writing the offer letter text itself, or prepping negotiation   `[knowledge-work-plugins/human-resources/skills/draft-offer]`
- **draft-outreach** — Draft a personalized outreach email or multi-touch sequence to a prospect, create it as an email draft for review, and add the contact to a sequence in your sales engagement tool when asked. Use when the user asks to "dr  `[knowledge-work-plugins/sales/skills/draft-outreach]`
- **draft-response** — Draft a professional customer-facing response tailored to the situation and relationship. Use when answering a product question, responding to an escalation or outage, delivering bad news like a delay or won't-fix, decli  `[knowledge-work-plugins/customer-support/skills/draft-response]`
- **email-sequence** — Design and draft multi-email sequences with full copy, timing, branching logic, exit conditions, and performance benchmarks. Use when building onboarding, lead nurture, re-engagement, win-back, or product launch flows, w  `[knowledge-work-plugins/marketing/skills/email-sequence]`
- **end-of-day** — The closing beat of the day - every call processed or explicitly skipped, the CRM brought current, commitments captured, and tomorrow's top three teed up. Use when the user says "end of day", "close out my day", "process  `[knowledge-work-plugins/sales/skills/end-of-day]`
- **enrich-lead** — Instant lead enrichment. Drop a name, company, LinkedIn URL, or email and get the full contact card with email, phone, title, company intel, and next actions." user-invocable: true argument-hint: "[name, company, LinkedI  `[knowledge-work-plugins/partner-built/apollo/skills/enrich-lead]`
- **expansion-whitespace** — Find the expansion whitespace in an account or a book - what they own vs. what they could own, the evidence for each play, and the open opps to create. Use when the user asks "what's the whitespace at [account]", "where   `[knowledge-work-plugins/sales/skills/expansion-whitespace]`
- **explore-data** — Profile and explore a dataset to understand its shape, quality, and patterns. Use when encountering a new table or file, checking null rates and column distributions, spotting data quality issues like duplicates or suspi  `[knowledge-work-plugins/data/skills/explore-data]`
- **financial-statements** — Generate financial statements (income statement, balance sheet, cash flow) with period-over-period comparison and variance analysis. Use when preparing a monthly or quarterly P&L, closing the books and need to flag mater  `[knowledge-work-plugins/finance/skills/financial-statements]`
- **forecast** — Generate the commit / best-case / pipeline narrative for a forecast call or a 1:1 with your manager - what's closing, what's at risk, what changed since last time. Use when the user asks "write my forecast", "forecast na  `[knowledge-work-plugins/sales/skills/forecast]`
- **grant-rfp-writer** — > Finds grant and solicitation opportunities the organization actually qualifies for, runs a hard go/no-go before anyone starts writing, drafts the application or response from past submissions and real program data, and  `[knowledge-work-plugins/small-business/skills/grant-rfp-writer]`
- **grow-pipeline** — Fills the funnel end to end without the owner babysitting it — reads the market and the competition for context, builds a ranked list of named prospects with a reason attached to each, writes personalized outreach in the  `[knowledge-work-plugins/small-business/skills/grow-pipeline]`
- **growth-pulse** — > Answers one question for an SMB owner — is the growth engine actually working? Pulls sales trend by channel, funnel conversion, campaign return, best and worst performing products, and customer sentiment from whatever   `[knowledge-work-plugins/small-business/skills/growth-pulse]`
- **guideline-generation** — > This skill generates, creates, or builds brand voice guidelines from source materials. It should be used when the user asks to "generate brand guidelines", "create a style guide", "extract brand voice", "create guideli  `[knowledge-work-plugins/partner-built/brand-voice/skills/guideline-generation]`
- **handle-objection** — Work through a live objection or competitive threat - what's really being said, the response that has worked before, and the proof points to use, grounded in your own win/loss history and customer quotes. Use when the us  `[knowledge-work-plugins/sales/skills/handle-objection]`
- **hiring-screener** — > Takes a pile of applications and turns it into a ranked shortlist, scored only against the job's stated rubric, with drafted replies to every candidate, scheduled interviews, and an onboarding checklist for whoever get  `[knowledge-work-plugins/small-business/skills/hiring-screener]`
- **inbox-manager** — > Turns a full inbox into a short, ranked list of what actually needs the owner. Reads the mail, sorts it into needs-you, drafted-and-waiting, and handled, writes replies in the owner's own voice, pulls out the action it  `[knowledge-work-plugins/small-business/skills/inbox-manager]`
- **inbox-sweep** — Batch-process unread customer emails - classify, prioritize, and draft replies. Use when the user asks "sweep my inbox", "what customer emails need a reply", "draft replies to my customer emails", or "what needs a respon  `[knowledge-work-plugins/sales/skills/inbox-sweep]`
- **incident-response** — Run an incident response workflow — triage, communicate, and write postmortem. Trigger with "we have an incident", "production is down", an alert that needs severity assessment, a status update mid-incident, or when writ  `[knowledge-work-plugins/engineering/skills/incident-response]`
- **instrument-data-to-allotrope** — Convert laboratory instrument output files (PDF, CSV, Excel, TXT) to Allotrope Simple Model (ASM) JSON format or flattened 2D CSV. Use this skill when scientists need to standardize instrument data for LIMS systems, data  `[knowledge-work-plugins/bio-research/skills/instrument-data-to-allotrope]`
- **interview-prep** — Create structured interview plans with competency-based questions and scorecards. Trigger with "interview plan for", "interview questions for", "how should we interview", "scorecard for", or when the user is preparing to  `[knowledge-work-plugins/human-resources/skills/interview-prep]`
- **inventory-planner** — > Works out what to reorder and when, from what is actually selling: pulls sales history and stock on hand from Shopify, Square, NetSuite, or an uploaded CSV, computes 7-day and 28-day sales velocity per item, projects a  `[knowledge-work-plugins/small-business/skills/inventory-planner]`
- **invoice-chase** — > Drafts overdue-invoice reminder emails from the ledger (MYOB, NetSuite, QuickBooks, Xero, or Zoho Books) plus PayPal, Stripe, and Airwallex data, matched to each customer's payment history and tone (gentle for good cus  `[knowledge-work-plugins/small-business/skills/invoice-chase]`
- **job-post-builder** — > Builds end-to-end hiring packets — job post, structured interview guide with scoring rubric, and offer letter template — from a hiring brief. Triggers on: "help me hire", "we're hiring for", "write a job post", "job de  `[knowledge-work-plugins/small-business/skills/job-post-builder]`
- **journal-entry** — Prepare journal entries with proper debits, credits, and supporting detail. Use when booking month-end accruals (AP, payroll, prepaid), recording depreciation or amortization, posting revenue recognition or deferred reve  `[knowledge-work-plugins/finance/skills/journal-entry]`
- **journal-entry-prep** — Prepare journal entries with proper debits, credits, and supporting documentation for month-end close. Use when booking accruals, prepaid amortization, fixed asset depreciation, payroll entries, revenue recognition, or a  `[knowledge-work-plugins/finance/skills/journal-entry-prep]`
- **kb-article** — Draft a knowledge base article from a resolved issue or common question. Use when a ticket resolution is worth documenting for self-service, the same question keeps coming up, a workaround needs to be published, or a kno  `[knowledge-work-plugins/customer-support/skills/kb-article]`
- **knowledge-synthesis** — Combines search results from multiple sources into coherent, deduplicated answers with source attribution. Handles confidence scoring based on freshness and authority, and summarizes large result sets effectively. user-i  `[knowledge-work-plugins/enterprise-search/skills/knowledge-synthesis]`
- **lead-finder** — > Builds a ranked list of prospects worth contacting. Works out the owner's ideal customer profile from the customers they already have, finds look-alike companies and the right contact at each, enriches them with firmog  `[knowledge-work-plugins/small-business/skills/lead-finder]`
- **lead-triage** — Score and route an inbound lead, or rank a backlog of leads, against your ICP and qualification framework, then recommend a priority and next action. Use when the user asks "triage this lead", "triage my leads", "rank my  `[knowledge-work-plugins/sales/skills/lead-triage]`
- **lead-triage** — > Scores inbound HubSpot leads by engagement signals, company fit, and urgency markers, ranks the ones worth a call today with talking points, drafts the follow-ups, and proposes calendar times for the owner to book. Use  `[knowledge-work-plugins/small-business/skills/lead-triage]`
- **legal-response** — Generate a response to a common legal inquiry using configured templates, with built-in escalation checks for situations that shouldn't use a templated reply. Use when responding to data subject requests, litigation hold  `[knowledge-work-plugins/legal/skills/legal-response]`
- **legal-risk-assessment** — Assess and classify legal risks using a severity-by-likelihood framework with escalation criteria. Use when evaluating contract risk, assessing deal exposure, classifying issues by severity, or determining whether a matt  `[knowledge-work-plugins/legal/skills/legal-risk-assessment]`
- **log-activity** — Log a call, meeting, or email exchange to the CRM after the fact as a completed activity on the right account, opportunity, and contact - drafted from your description or a transcript, shown with its sources and saved wh  `[knowledge-work-plugins/sales/skills/log-activity]`
- **marketing-monday** — Delivers the weekly growth briefing as one merged read — whether the growth engine is working, what customers are saying in public and private, what competitors actually changed, and the three growth actions worth taking  `[knowledge-work-plugins/small-business/skills/marketing-monday]`
- **meeting-briefing** — Prepare structured briefings for meetings with legal relevance and track resulting action items. Use when preparing for contract negotiations, board meetings, compliance reviews, or any meeting where legal context, backg  `[knowledge-work-plugins/legal/skills/meeting-briefing]`
- **meeting-sdk/linux** — Zoom Meeting SDK for Linux - C++ headless meeting bots with raw audio/video access, transcription, recording, and AI integration for server-side automation" user-invocable: false triggers: - "linux meeting bot" - "headle  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/linux]`
- **memory-management** — Two-tier memory system that makes Claude a true workplace collaborator. Decodes shorthand, acronyms, nicknames, and internal language so Claude understands requests like a colleague would. CLAUDE.md for working memory, m  `[knowledge-work-plugins/productivity/skills/memory-management]`
- **metrics-review** — Review and analyze product metrics with trend analysis and actionable insights. Use when running a weekly, monthly, or quarterly metrics review, investigating a sudden spike or drop, comparing performance against targets  `[knowledge-work-plugins/product-management/skills/metrics-review]`
- **monday-brief** — Runs the owner's Monday morning briefing as a two-link chain — business-pulse for the cross-connector snapshot of cash, sales, and pipeline, and report-builder for any saved KPI reports the owner has already defined — th  `[knowledge-work-plugins/small-business/skills/monday-brief]`
- **month-end-prep** — > Reconciles the accounting ledger (MYOB, NetSuite, QuickBooks, Xero, or Zoho Books) against PayPal, Shopify, Square, and Stripe settlements, flags transactions that need attention, suspicious duplicates, and missing rec  `[knowledge-work-plugins/small-business/skills/month-end-prep]`
- **nextflow-development** — Run nf-core bioinformatics pipelines (rnaseq, sarek, atacseq) on sequencing data. Use when analyzing RNA-seq, WGS/WES, or ATAC-seq data—either local FASTQs or public datasets from GEO/SRA. Triggers on nf-core, Nextflow,   `[knowledge-work-plugins/bio-research/skills/nextflow-development]`
- **onboarding** — Generate an onboarding checklist and first-week plan for a new hire. Use when someone has a start date coming up, building the pre-start task list (accounts, equipment, buddy), scheduling Day 1 and Week 1, or setting 30/  `[knowledge-work-plugins/human-resources/skills/onboarding]`
- **org-planning** — Headcount planning, org design, and team structure optimization. Trigger with "org planning", "headcount plan", "team structure", "reorg", "who should we hire next", or when the user is thinking about team size, reportin  `[knowledge-work-plugins/human-resources/skills/org-planning]`
- **outreach-composer** — > Writes prospect outreach and follow-up sequences that sound like the owner wrote them, not like an AI did. Learns a voice profile from the owner's own sent mail, grounds every message in something specific about that p  `[knowledge-work-plugins/small-business/skills/outreach-composer]`
- **pay-the-bills** — Works the bill pile from the AP inbox all the way to a staged payment run — reads and codes every bill, then checks the cash position before a dollar is committed, then stages the run for one-click approval and keeps the  `[knowledge-work-plugins/small-business/skills/pay-the-bills]`
- **payroll-prep** — > Gets payroll ready to run without anyone getting shorted: pulls timesheets from Gusto, QuickBooks Payroll, or an uploaded spreadsheet, totals regular, overtime, and PTO hours by person, flags every anomaly it finds — m  `[knowledge-work-plugins/small-business/skills/payroll-prep]`
- **people-report** — Generate headcount, attrition, diversity, or org health reports. Use when pulling a headcount snapshot for leadership, analyzing turnover trends by team, preparing diversity representation metrics, or assessing span of c  `[knowledge-work-plugins/human-resources/skills/people-report]`
- **performance-report** — Build a marketing performance report with key metrics, trend analysis, wins and misses, and prioritized optimization recommendations. Use when wrapping a campaign, when preparing weekly, monthly, or quarterly channel sum  `[knowledge-work-plugins/marketing/skills/performance-report]`
- **performance-review** — Structure a performance review with self-assessment, manager template, and calibration prep. Use when review season kicks off and you need a self-assessment template, writing a manager review for a direct report, preppin  `[knowledge-work-plugins/human-resources/skills/performance-review]`
- **pipeline-review** — Stage-by-stage pipeline health check - coverage, aging, conversion, and at-risk deals - from CRM opportunity data. Use when the user asks "review my pipeline", "pipeline health", "where's my pipeline stuck", "weekly pipe  `[knowledge-work-plugins/sales/skills/pipeline-review]`
- **plan-payroll** — Runs the payroll-confidence chain end to end — forecasts cash across the payroll window with cash-flow-snapshot, ranks and drafts overdue-invoice reminders with invoice-chase to close any gap, then assembles timesheets,   `[knowledge-work-plugins/small-business/skills/plan-payroll]`
- **plan-zoom-integration** — Turn a Zoom integration idea into an implementation plan with architecture, auth, and delivery milestones. Use when you need a practical build plan, phased delivery sequence, risk list, and next-step recommendation. argu  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/plan-zoom-integration]`
- **plan-zoom-product** — Choose the right Zoom building surface for a use case and explain the tradeoffs clearly. Use when deciding between REST API, Webhooks, WebSockets, Meeting SDK, Video SDK, Zoom Apps SDK, Phone, Contact Center, or MCP for   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/plan-zoom-product]`
- **policy-lookup** — Find and explain company policies in plain language. Trigger with "what's our PTO policy", "can I work remotely from another country", "how do expenses work", or any plain-language question about benefits, travel, leave,  `[knowledge-work-plugins/human-resources/skills/policy-lookup]`
- **probe-sdk** — Reference skill for Zoom Probe SDK. Use after routing to a preflight workflow when testing browser compatibility, media permissions, audio or video diagnostics, and network readiness before users join." user-invocable: f  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/probe-sdk]`
- **process-doc** — Document a business process — flowcharts, RACI, and SOPs. Use when formalizing a process that lives in someone's head, building a RACI to clarify who owns what, writing an SOP for a handoff or audit, or capturing the exc  `[knowledge-work-plugins/operations/skills/process-doc]`
- **process-optimization** — Analyze and improve business processes. Trigger with "this process is slow", "how can we improve", "streamline this workflow", "too many steps", "bottleneck", or when the user describes an inefficient process they want t  `[knowledge-work-plugins/operations/skills/process-optimization]`
- **product-brainstorming** — Brainstorm product ideas, explore problem spaces, and challenge assumptions as a thinking partner. Use when exploring a new opportunity, generating solutions to a product problem, stress-testing an idea, or when a PM nee  `[knowledge-work-plugins/product-management/skills/product-brainstorming]`
- **proposal-builder** — > Turns whatever came out of a discovery conversation — a call transcript, a voice memo, jobsite photos, an RFP document, a set of drawings, or scrappy notes — into a branded, costed proposal, estimate, or statement of w  `[knowledge-work-plugins/small-business/skills/proposal-builder]`
- **prospect** — Full ICP-to-leads pipeline. Describe your ideal customer in plain English and get a ranked table of enriched decision-maker leads with emails and phone numbers." user-invocable: true argument-hint: "[describe your ideal   `[knowledge-work-plugins/partner-built/apollo/skills/prospect]`
- **prospect** — Build targeted account or contact lists using Common Room's Prospector. Triggers on 'find companies that match [criteria]', 'build a prospect list', 'find contacts at [type of company]', 'show me companies hiring [role]'  `[knowledge-work-plugins/partner-built/common-room/skills/prospect]`
- **reactivate** — Wins back customers who have quietly stopped buying — finds the ones whose gap has stretched past their own normal rhythm or who are showing churn signals, ranks them by what the relationship was worth, drafts a win-back  `[knowledge-work-plugins/small-business/skills/reactivate]`
- **reconciliation** — Reconcile accounts by comparing GL balances to subledgers, bank statements, or third-party data. Use when performing bank reconciliations, GL-to-subledger recs, intercompany reconciliations, or identifying and categorizi  `[knowledge-work-plugins/finance/skills/reconciliation]`
- **recruiting-pipeline** — Track and manage recruiting pipeline stages. Trigger with "recruiting update", "candidate pipeline", "how many candidates", "hiring status", or when the user discusses sourcing, screening, interviewing, or extending offe  `[knowledge-work-plugins/human-resources/skills/recruiting-pipeline]`
- **renewal-radar** — Upcoming renewals with timing, risk, and uplift potential - and the renewal opportunity records to keep them honest. Use when the user asks "what renewals are coming up", "renewal radar", "is [account] going to renew", "  `[knowledge-work-plugins/sales/skills/renewal-radar]`
- **rep-context** — Leader's prep on a single rep before a 1:1 - their pipeline, recent activity, what they've been working on per chat and calendar, and where they might need help. Use when the user asks "prep for my 1:1 with [rep]" (a rep  `[knowledge-work-plugins/sales/skills/rep-context]`
- **report-builder** — > Turns a plain-English description of a recurring report into a real, repeatable report — defines the metrics, pulls them from whatever data sources are connected, delivers a chat summary plus an XLSX workbook, and save  `[knowledge-work-plugins/small-business/skills/report-builder]`
- **report-pack** — Delivers the owner's custom recurring report pack on a set cadence — runs the saved report definition from report-builder, wraps it in a business-pulse snapshot so the numbers have context, and hands over one chat summar  `[knowledge-work-plugins/small-business/skills/report-pack]`
- **research-synthesis** — Synthesize user research into themes, insights, and recommendations. Use when you have interview transcripts, survey results, usability test notes, support tickets, or NPS responses that need to be distilled into pattern  `[knowledge-work-plugins/design/skills/research-synthesis]`
- **restock** — Turns what is actually selling into a reorder decision and gets it all the way into the books — computes sales velocity and conservative stockout dates per item, sizes the reorder, drafts the purchase order and the vendo  `[knowledge-work-plugins/small-business/skills/restock]`
- **review-contract** — Review a contract against your organization's negotiation playbook — flag deviations, generate redlines, provide business impact analysis. Use when reviewing vendor or customer agreements, when you need clause-by-clause   `[knowledge-work-plugins/legal/skills/review-contract]`
- **review-reputation** — > Watches what customers are saying in public and in private, then does something about it. Aggregates Google, Yelp, and Facebook reviews alongside disputes, tickets, and email into themes backed by verbatim quotes; draf  `[knowledge-work-plugins/small-business/skills/review-reputation]`
- **risk-assessment** — Identify, assess, and mitigate operational risks. Trigger with "what are the risks", "risk assessment", "risk register", "what could go wrong", or when the user is evaluating risks associated with a project, vendor, proc  `[knowledge-work-plugins/operations/skills/risk-assessment]`
- **rivet-sdk** — Reference skill for Zoom Rivet SDK. Use after routing to a Rivet-based server workflow when implementing auth handling, webhook consumers, API wrappers, multi-module composition, or Lambda receiver patterns." user-invoca  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/rivet-sdk]`
- **roadmap-update** — Update, create, or reprioritize your product roadmap. Use when adding a new initiative and deciding what moves to make room, shifting priorities after new information comes in, moving timelines due to a dependency slip,   `[knowledge-work-plugins/product-management/skills/roadmap-update]`
- **route-lead** — Decide who owns an unrouted lead or opportunity and manage the handoff - deterministic routing by the org's own rules, a routing card the human router accepts or overrides, and drafted handoff notes. Use when the user sa  `[knowledge-work-plugins/sales/skills/route-lead]`
- **runbook** — Create or update an operational runbook for a recurring task or procedure. Use when documenting a task that on-call or ops needs to run repeatably, turning tribal knowledge into exact step-by-step commands, adding troubl  `[knowledge-work-plugins/operations/skills/runbook]`
- **schedule-meeting** — Find a time, draft the invite, and book the meeting on Google Calendar or Outlook - then log it to the CRM as an event on the right account and opportunity. Use when the user says "schedule a follow-up with [contact]", "  `[knowledge-work-plugins/sales/skills/schedule-meeting]`
- **scientific-problem-selection** — This skill should be used when scientists need help with research problem selection, project ideation, troubleshooting stuck projects, or strategic scientific decisions. Use this skill when users ask to pitch a new resea  `[knowledge-work-plugins/bio-research/skills/scientific-problem-selection]`
- **scribe** — Reference skill for Zoom AI Services Scribe. Use after routing to a transcription workflow when handling uploaded or stored media, Build-platform JWT auth, fast mode transcription, batch jobs, or transcript pipeline desi  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/scribe]`
- **scvi-tools** — Deep learning for single-cell analysis using scvi-tools. This skill should be used when users need (1) data integration and batch correction with scVI/scANVI, (2) ATAC-seq analysis with PeakVI, (3) CITE-seq multi-modal a  `[knowledge-work-plugins/bio-research/skills/scvi-tools]`
- **search** — Search across all connected sources in one query. Trigger with "find that doc about...", "what did we decide on...", "where was the conversation about...", or when looking for a decision, document, or discussion that cou  `[knowledge-work-plugins/enterprise-search/skills/search]`
- **search-strategy** — Query decomposition and multi-source search orchestration. Breaks natural language questions into targeted searches per source, translates queries into source-specific syntax, ranks results by relevance, and handles ambi  `[knowledge-work-plugins/enterprise-search/skills/search-strategy]`
- **seo-ai-visibility** — > Audits and fixes both halves of being found — classic search and AI answers. Search side: rankings, site structure, page speed, titles and descriptions, and content that answers what customers search for. AI side: whet  `[knowledge-work-plugins/small-business/skills/seo-ai-visibility]`
- **seo-audit** — Run a comprehensive SEO audit — keyword research, on-page analysis, content gaps, technical checks, and competitor comparison. Use when assessing a site's SEO health, when finding keyword opportunities and content gaps c  `[knowledge-work-plugins/marketing/skills/seo-audit]`
- **sequence-load** — Find leads matching criteria and bulk-add them to an Apollo outreach sequence. Handles enrichment, contact creation, deduplication, and enrollment in one flow." user-invocable: true argument-hint: "[targeting criteria +   `[knowledge-work-plugins/partner-built/apollo/skills/sequence-load]`
- **setup** — First-run setup - checks which tools are connected, shows what's connected and what each one unlocks, learns how you write from your sent email, and renders a starter dashboard right away with no upfront interview. When   `[knowledge-work-plugins/sales/skills/setup]`
- **setup-zoom-mcp** — Decide when Zoom MCP is the right fit and produce a safe setup plan for Claude. Use when planning AI workflows over Zoom data, deciding between MCP and REST, or defining a hybrid MCP architecture. argument-hint: "<AI wor  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/setup-zoom-mcp]`
- **setup-zoom-oauth** — Implement Zoom authentication correctly. Use when setting up app credentials, choosing an OAuth grant, requesting scopes, handling token refresh, or debugging auth failures. --- # /setup-zoom-oauth Use this skill when au  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/setup-zoom-oauth]`
- **setup-zoom-webhooks** — Reference skill for Zoom webhooks. Use after routing to an event-driven workflow when implementing subscriptions, signature verification, delivery handling, retries, or event-type selection. triggers: - "zoom webhook" -   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/webhooks]`
- **setup-zoom-websockets** — Reference skill for Zoom WebSockets. Use after routing to a low-latency event workflow when persistent connections, faster event delivery, or security constraints make WebSockets preferable to webhooks. triggers: - "zoom  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/websockets]`
- **signature-request** — Prepare and route a document for e-signature — run a pre-signature checklist, configure signing order, and send for execution. Use when a contract is finalized and ready to sign, when verifying entity names, exhibits, an  `[knowledge-work-plugins/legal/skills/signature-request]`
- **single-cell-rna-qc** — Performs quality control on single-cell RNA-seq data (.h5ad or .h5 files) using scverse best practices with MAD-based filtering and comprehensive visualizations. Use when users request QC analysis, filtering low-quality   `[knowledge-work-plugins/bio-research/skills/single-cell-rna-qc]`
- **slack-messaging** — Guidance for composing well-formatted, effective Slack messages using mrkdwn syntax --- # Slack Messaging Best Practices This skill provides guidance for composing well-formatted, effective Slack messages. ## When to Use  `[knowledge-work-plugins/partner-built/slack/skills/slack-messaging]`
- **slack-search** — Guidance for effectively searching Slack to find messages, files, channels, and people --- # Slack Search This skill provides guidance for effectively searching Slack to find messages, files, and information. ## When to   `[knowledge-work-plugins/partner-built/slack/skills/slack-search]`
- **smb-onboard** — > Claude as the trainer. Walks an SMB owner through connecting their first two tools, runs one recipe to prove immediate value, interviews them about their business (industry, size, top three headaches), stores that cont  `[knowledge-work-plugins/small-business/skills/smb-onboard]`
- **smb-router** — > The front door to the Small Business plugin. Listens to what the owner needs right now — vague or specific — and routes them to the best skill or slash command for the moment. Also serves as a guide: explains what's av  `[knowledge-work-plugins/small-business/skills/smb-router]`
- **social-content-engine** — > Runs the owner's content operation as a standing thing rather than a one-off: keeps a rolling posting calendar, learns the owner's voice, generates on-brand Canva graphics, writes captions that sound like them, repurpo  `[knowledge-work-plugins/small-business/skills/social-content-engine]`
- **source-management** — Manages connected MCP sources for enterprise search. Detects available sources, guides users to connect new ones, handles source priority ordering, and manages rate limiting awareness. user-invocable: false --- # Source   `[knowledge-work-plugins/enterprise-search/skills/source-management]`
- **sox-testing** — Generate SOX sample selections, testing workpapers, and control assessments. Use when planning quarterly or annual SOX 404 testing, pulling a sample for a control (revenue, P2P, ITGC, close), building a testing workpaper  `[knowledge-work-plugins/finance/skills/sox-testing]`
- **speed-to-lead** — > Makes sure no inbound lead goes unanswered. Watches web forms, the shared inbox, and the CRM for new inquiries, qualifies each one against the owner's criteria, drafts a reply in the owner's voice with real meeting tim  `[knowledge-work-plugins/small-business/skills/speed-to-lead]`
- **sprint-planning** — Plan a sprint — scope work, estimate capacity, set goals, and draft a sprint plan. Use when kicking off a new sprint, sizing a backlog against team availability (accounting for PTO and meetings), deciding what's P0 vs. s  `[knowledge-work-plugins/product-management/skills/sprint-planning]`
- **sql-queries** — Write correct, performant SQL across all major data warehouse dialects (Snowflake, BigQuery, Databricks, PostgreSQL, etc.). Use when writing queries, optimizing slow SQL, translating between dialects, or building complex  `[knowledge-work-plugins/data/skills/sql-queries]`
- **stakeholder-map** — Map the people in a deal or account - roles, influence, sentiment, who's missing, and your best access path to the people you haven't reached. Use when the user asks "who are the players at [account]", "who's my way in",  `[knowledge-work-plugins/sales/skills/stakeholder-map]`
- **stakeholder-update** — Generate a stakeholder update tailored to audience and cadence. Use when writing a weekly or monthly status for leadership, announcing a launch, escalating a risk or blocker, or translating the same progress into exec-br  `[knowledge-work-plugins/product-management/skills/stakeholder-update]`
- **standup** — Generate a standup update from recent activity. Use when preparing for daily standup, summarizing yesterday's commits and PRs and ticket moves, formatting work into yesterday/today/blockers, or structuring a few rough no  `[knowledge-work-plugins/engineering/skills/standup]`
- **start** — Set up your bio-research environment and explore available tools. Use when first getting oriented with the plugin, checking which literature, drug-discovery, or visualization MCP servers are connected, or surveying avail  `[knowledge-work-plugins/bio-research/skills/start]`
- **start** — Start here for any Zoom integration or app idea. Use when you need to choose the right Zoom surface, shape the architecture, or route into the correct implementation skill without reading the whole Zoom doc set first. --  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/start]`
- **start** — Initialize the productivity system and open the dashboard. Use when setting up the plugin for the first time, bootstrapping working memory from your existing task list, or decoding the shorthand (nicknames, acronyms, pro  `[knowledge-work-plugins/productivity/skills/start]`
- **statistical-analysis** — Apply statistical methods including descriptive stats, trend analysis, outlier detection, and hypothesis testing. Use when analyzing distributions, testing for significance, detecting anomalies, computing correlations, o  `[knowledge-work-plugins/data/skills/statistical-analysis]`
- **status-report** — Generate a status report with KPIs, risks, and action items. Use when writing a weekly or monthly update for leadership, summarizing project health with green/yellow/red status, surfacing risks and decisions that need st  `[knowledge-work-plugins/operations/skills/status-report]`
- **synthesize-research** — Synthesize user research from interviews, surveys, and feedback into structured insights. Use when you have a pile of interview notes, survey responses, or support tickets to make sense of, need to extract themes and ran  `[knowledge-work-plugins/product-management/skills/synthesize-research]`
- **system-design** — Design systems, services, and architectures. Trigger with "design a system for", "how should we architect", "system design for", "what's the right architecture for", or when the user needs help with API design, data mode  `[knowledge-work-plugins/engineering/skills/system-design]`
- **task-management** — Simple task management using a shared TASKS.md file. Reference this when the user asks about their tasks, wants to add/complete tasks, or needs help tracking commitments. user-invocable: false --- # Task Management Tasks  `[knowledge-work-plugins/productivity/skills/task-management]`
- **tax-prep** — Prepares tax materials as a two-link chain — month-end-prep confirms the books are closed and reconciled first, then tax-season-organizer calculates the quarterly estimated payment or builds the year-end 1099-NEC list an  `[knowledge-work-plugins/small-business/skills/tax-prep]`
- **tax-season-organizer** — > Prepares tax-season materials for the owner's accountant, not tax advice. US federal tax; a non-US business gets its closed-books packet instead. Two modes: (1) quarterly estimated tax from YTD net income in the ledger  `[knowledge-work-plugins/small-business/skills/tax-season-organizer]`
- **team-pipeline** — Leader view - roll up a team's pipeline by rep and stage, flag at-risk deals, and surface coaching moments. Use when the user asks "show my team's pipeline", "team forecast", "prep for my team's pipeline review", or "whe  `[knowledge-work-plugins/sales/skills/team-pipeline]`
- **tech-debt** — Identify, categorize, and prioritize technical debt. Trigger with "tech debt", "technical debt audit", "what should we refactor", "code health", or when the user asks about code quality, refactoring priorities, or mainte  `[knowledge-work-plugins/engineering/skills/tech-debt]`
- **testing-strategy** — Design test strategies and test plans. Trigger with "how should we test", "test strategy for", "write tests for", "test plan", "what tests do we need", or when the user needs help with testing approaches, coverage, or te  `[knowledge-work-plugins/engineering/skills/testing-strategy]`
- **ticket-deflector** — > Reads a forwarded customer email or ticket, pulls order and refund status from a payments connector (PayPal, Square, or Stripe) or Shopify, account history from the CRM, and open tickets from a support desk (Zoho Desk)  `[knowledge-work-plugins/small-business/skills/ticket-deflector]`
- **ticket-triage** — Triage and prioritize a support ticket or customer issue. Use when a new ticket comes in and needs categorization, assigning P1-P4 priority, deciding which team should handle it, or checking whether it's a duplicate or k  `[knowledge-work-plugins/customer-support/skills/ticket-triage]`
- **triage-nda** — Rapidly triage an incoming NDA and classify it as GREEN (standard approval), YELLOW (counsel review), or RED (full legal review). Use when a new NDA arrives from sales or business development, when screening for embedded  `[knowledge-work-plugins/legal/skills/triage-nda]`
- **ui-toolkit/web** — Reference skill for Zoom Video SDK UI Toolkit. Use after routing to a web video workflow when you want prebuilt React UI instead of building a fully custom Video SDK interface." user-invocable: false triggers: - "ui tool  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/ui-toolkit]`
- **update** — Sync tasks and refresh memory from your current activity. Use when pulling new assignments from your project tracker into TASKS.md, triaging stale or overdue tasks, filling memory gaps for unknown people or projects, or   `[knowledge-work-plugins/productivity/skills/update]`
- **update-opportunity** — Guided updates to an opportunity - push the stage, move the close date, set next steps, fix amount or forecast category. Shows the before/after, writes what you ask for or accept, and verifies with a record link. Use whe  `[knowledge-work-plugins/sales/skills/update-opportunity]`
- **user-research** — Plan, conduct, and synthesize user research. Trigger with "user research plan", "interview guide", "usability test", "survey design", "research questions", or when the user needs help with any aspect of understanding the  `[knowledge-work-plugins/design/skills/user-research]`
- **ux-copy** — Write or review UX copy — microcopy, error messages, empty states, CTAs. Trigger with "write copy for", "what should this button say?", "review this error message", or when naming a CTA, wording a confirmation dialog, fi  `[knowledge-work-plugins/design/skills/ux-copy]`
- **validate-data** — QA an analysis before sharing -- methodology, accuracy, and bias checks. Use when reviewing an analysis before a stakeholder presentation, spot-checking calculations and aggregation logic, verifying a SQL query's results  `[knowledge-work-plugins/data/skills/validate-data]`
- **variance-analysis** — Decompose financial variances into drivers with narrative explanations and waterfall analysis. Use when analyzing budget vs. actual, period-over-period changes, revenue or expense variances, or preparing variance comment  `[knowledge-work-plugins/finance/skills/variance-analysis]`
- **vendor-check** — Check the status of existing agreements with a vendor across all connected systems — CLM, CRM, email, and document storage — with gap analysis and upcoming deadlines. Use when onboarding or renewing a vendor, when you ne  `[knowledge-work-plugins/legal/skills/vendor-check]`
- **vendor-review** — Evaluate a vendor — cost analysis, risk assessment, and recommendation. Use when reviewing a new vendor proposal, deciding whether to renew or replace a contract, comparing two vendors side-by-side, or building a TCO bre  `[knowledge-work-plugins/operations/skills/vendor-review]`
- **video-sdk/linux** — Zoom Video SDK for Linux - C++ headless bots, raw audio/video capture/injection, Qt/GTK integration, Docker support" user-invocable: false triggers: - linux video sdk - zoom linux - raw data linux - qt zoom - gtk zoom -   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/linux]`
- **video-sdk/web** — Zoom Video SDK for Web - JavaScript/TypeScript integration for browser-based video sessions, real-time communication, screen sharing, recording, and live transcription" user-invocable: false triggers: - "video sdk web" -  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/web]`
- **video-sdk/windows** — Zoom Video SDK for Windows - C++ integration for video sessions, raw audio/video capture, screen sharing, recording, and real-time communication" user-invocable: false triggers: - "video sdk windows" - "windows video sdk  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/windows]`
- **view-pdf** — Interactive PDF viewer. Use when the user wants to open, show, or view a PDF and collaborate on it visually — annotate, highlight, stamp, fill form fields, place signature/initials, or review markup together. Not for sum  `[knowledge-work-plugins/pdf-viewer/skills/view-pdf]`
- **virtual-agent/android** — Zoom Virtual Agent Android integration via WebView. Use for Java/Kotlin bridge callbacks, native URL handling, support_handoff relay, and lifecycle-safe embedding." user-invocable: false triggers: - "virtual agent androi  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/virtual-agent/android]`
- **virtual-agent/ios** — Zoom Virtual Agent iOS integration via WKWebView. Use for Swift/Objective-C script injection, message handlers, support_handoff relay, and URL routing policies." user-invocable: false triggers: - "virtual agent ios" - "w  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/virtual-agent/ios]`
- **virtual-agent/web** — Zoom Virtual Agent SDK for web embeds. Use for campaign or entry ID chat launch, event-driven controls, user context updates, and CSP-safe deployment." user-invocable: false triggers: - "virtual agent web" - "zoomCampaig  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/virtual-agent/web]`
- **weekly-prep-brief** — Generate a comprehensive weekly briefing for all external calls in the next 7 days. Triggers on 'weekly prep brief', 'prepare my week', 'what calls do I have this week', 'Monday prep', or any weekly planning request." --  `[knowledge-work-plugins/partner-built/common-room/skills/weekly-prep-brief]`
- **weekly-wrap** — End-of-week summary for a rep or leader - what closed, what moved, what slipped, and what's on deck Monday. Optionally drafts a chat post to the team channel. Use when the user says "weekly wrap", "week in review", "what  `[knowledge-work-plugins/sales/skills/weekly-wrap]`
- **win-loss-review** — Analyze recently closed opportunities to find patterns in what wins and what loses - stage of loss, common objections from transcripts, deal characteristics. Leader-focused. Use when the user asks "win loss review", "why  `[knowledge-work-plugins/sales/skills/win-loss-review]`
- **write-query** — Write optimized SQL for your dialect with best practices. Use when translating a natural-language data need into SQL, building a multi-CTE query with joins and aggregations, optimizing a query against a large partitioned  `[knowledge-work-plugins/data/skills/write-query]`
- **write-spec** — Write a feature spec or PRD from a problem statement or feature idea. Use when turning a vague idea or user request into a structured document, scoping a feature with goals and non-goals, defining success metrics and acc  `[knowledge-work-plugins/product-management/skills/write-spec]`
- **zoom-apps-sdk** — Reference skill for Zoom Apps SDK. Use after routing to an in-client app workflow when building web apps that run inside Zoom meetings, webinars, the main client, or Zoom Phone. user-invocable: false triggers: - "zoom ap  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/zoom-apps-sdk]`
- **zoom-cobrowse-sdk** — Reference skill for Zoom Cobrowse SDK. Use after routing to a collaborative-support workflow when implementing browser co-browsing, annotation tools, privacy masking, remote assist, or PIN-based session sharing." user-in  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/cobrowse-sdk]`
- **zoom-general** — Cross-product Zoom reference skill. Use after the workflow is clear when you need shared platform guidance, app-model comparisons, authentication context, scopes, marketplace considerations, or API-vs-MCP routing. user-i  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/general]`
- **zoom-mcp** — Guidance for the bundled Zoom MCP connectors. Use after routing to an MCP workflow when planning or troubleshooting tool-based access to meetings, recordings, meeting assets, or transcripts. Route Zoom Docs requests to t  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/zoom-mcp]`
- **zoom-mcp/whiteboard** — | Guidance for the bundled Zoom Whiteboard MCP connector. Use for Whiteboard MCP auth, endpoints, ID mapping, and tool workflows such as list_whiteboards and get_a_whiteboard. Prefer this skill when the request is specif  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/zoom-mcp/whiteboard]`
- **zoom-meeting-sdk-android** — | Zoom Meeting SDK for Android native apps. Use when embedding Zoom meetings in Android with default/custom UI, PKCE + SDK auth, join/start flows, and Meeting SDK API integration. user-invocable: false triggers: - "meeti  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/android]`
- **zoom-meeting-sdk-electron** — | Zoom Meeting SDK for Electron desktop applications. Use when embedding Zoom meetings in an Electron app with the Node addon wrapper, JWT auth, join/start flows, settings controllers, and raw data integration. user-invo  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/electron]`
- **zoom-meeting-sdk-ios** — | Zoom Meeting SDK for iOS native apps. Use when embedding Zoom meetings in iOS with default/custom UI, PKCE + SDK auth, host start with ZAK, and mobile lifecycle handling. user-invocable: false triggers: - "meeting sdk   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/ios]`
- **zoom-meeting-sdk-macos** — | Zoom Meeting SDK for macOS native apps. Use when embedding Zoom meetings in macOS with default/custom UI, PKCE + SDK auth, host start/join flows, and desktop meeting feature controllers. user-invocable: false triggers:  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/macos]`
- **zoom-meeting-sdk-react-native** — Zoom Meeting SDK for React Native. Use when embedding Zoom meetings in React Native iOS/Android apps with @zoom/meetingsdk-react-native, JWT auth, join/start flows, platform setup, and native bridge troubleshooting. user  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/react-native]`
- **zoom-meeting-sdk-unreal** — | Zoom Meeting SDK for Unreal Engine wrapper integrations. Use when building Unreal projects that embed Zoom meetings with C++ and Blueprint wrappers, including wrapper-to-SDK mapping concerns. user-invocable: false trig  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/unreal]`
- **zoom-meeting-sdk-web** — | Zoom Meeting SDK for Web - Embed Zoom meeting capabilities into web applications. Two integration options: Client View (full-page, familiar Zoom UI) and Component View (embeddable, Promise-based API). Includes SharedAr  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/web]`
- **zoom-meeting-sdk-web-client-view** — | Zoom Meeting SDK Web - Client View. Full-page Zoom meeting experience with the familiar Zoom interface. Uses ZoomMtg global singleton with callback-based API. Ideal for quick integration with minimal customization. Pro  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/web/client-view]`
- **zoom-meeting-sdk-web-component-view** — | Zoom Meeting SDK Web - Component View. Embeddable Zoom meeting components with Promise-based API for flexible integration. Ideal for React/Vue/Angular apps and custom layouts. Uses ZoomMtgEmbedded with async/await patt  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/web/component-view]`
- **zoom-meeting-sdk-windows** — | Zoom Meeting SDK for Windows - Native C++ SDK for embedding Zoom meetings into Windows desktop applications. Supports custom UI architecture with raw video/audio data, headless bots, and deep integration with meeting f  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/meeting-sdk/windows]`
- **zoom-oauth** — Reference skill for Zoom authentication. Use after routing to an auth workflow when choosing app credentials, grant types, scopes, token refresh behavior, or debugging Zoom OAuth failures. user-invocable: false triggers:  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/oauth]`
- **zoom-rtms** — Reference skill for Zoom RTMS. Use after routing to a live-media workflow when processing real-time audio, video, chat, transcripts, screen share, or contact-center voice streams. user-invocable: false triggers: - "real-  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/rtms]`
- **zoom-video-sdk-android** — | Zoom Video SDK for Android native apps. Use when building custom Android video experiences with full UI control, session tokens, raw media options, and event-driven participant state. user-invocable: false triggers: -   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/android]`
- **zoom-video-sdk-flutter** — | Zoom Video SDK for Flutter. Use when building custom video session apps in Flutter with flutter_zoom_videosdk, event-driven architecture, session lifecycle handling, and mobile platform integration patterns. user-invoc  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/flutter]`
- **zoom-video-sdk-ios** — | Zoom Video SDK for iOS native apps. Use when building custom iOS video sessions with full UI control, token-based session auth, and event-driven media/participant flows. user-invocable: false triggers: - "video sdk ios  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/ios]`
- **zoom-video-sdk-macos** — | Zoom Video SDK for macOS native desktop apps. Use when building custom macOS video sessions with native UI control, tokenized join, and desktop-oriented media/device workflows. user-invocable: false triggers: - "video   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/macos]`
- **zoom-video-sdk-react-native** — | Zoom Video SDK for React Native. Use when building custom mobile video session experiences with @zoom/react-native-videosdk, event listeners, helper-based APIs, and backend JWT token flows. user-invocable: false trigge  `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/react-native]`
- **zoom-video-sdk-unity** — | Zoom Video SDK for Unity wrapper integrations. Use when building custom Unity-based video session experiences and mapping Unity scene/UI state to Video SDK events. user-invocable: false triggers: - "video sdk unity" -   `[knowledge-work-plugins/partner-built/zoom-plugin/skills/video-sdk/unity]`

## autoclip — 2 skill
https://github.com/zhouxiaoka/autoclip — Auto video clipping

- **autoclip** — >- 用 AutoClip 把一条 YouTube / B 站链接，或本地长视频（讲座、访谈、播客、课程），做成各平台成片、封面、发布文案和 ZIP 发布包。 当用户要「出片」「做封面」「写发布文案」「打包发布」「从这个链接做短视频」时使用。 只要原始高光切片、合集，或把旧切片发到 Upload-Post 时不要用这份说明，改读 references/legacy.md。 --- # AutoClip：从链接或长视频到发布包 AutoC  `[autoclip/skills/autoclip]`
- **product-board** — >- 维护 AutoClip 的公开社区看板。当用户要看社区反馈、整理功能呼声、把一条讨论放进路线图、 或问 GitHub Discussions、Projects、Quackback、Featurebase 该怎么接时使用。 想法留在 Discussions，只有人确认后才开 Issue。 --- # AutoClip 产品看板 规则的正文在 `docs/COMMUNITY_BOARD.md`。商业化阶段仍以 `ROADMAP.md`  `[autoclip/skills/product-board]`

## cinematic-shot — 1 skill
https://github.com/1weiho/cinematic-shot — Teknik cinematic shot untuk UI/software

- **cinematic-shot** — Shoot software UI like a film. A sequence of hero shots, each a steep, oblique, extreme close-up of the interface floating on a stage (a black void for dark products, a high-key studio for light ones), with a razor-thin   `[cinematic-shot/skills/cinematic-shot]`

## agency-agents — 304 definisi agen (tanpa SKILL.md)
https://github.com/msitarzewski/agency-agents — definisi agen per divisi dalam format .md

### academic (6)
- academic-anthropologist
- academic-geographer
- academic-historian
- academic-narratologist
- academic-psychologist
- academic-statistician

### design (10)
- design-brand-guardian
- design-image-prompt-engineer
- design-inclusive-visuals-specialist
- design-persona-walkthrough
- design-ui-designer
- design-ui-finish-gate-reviewer
- design-ux-architect
- design-ux-researcher
- design-visual-storyteller
- design-whimsy-injector

### engineering (65)
- engineering-ai-data-remediation-engineer
- engineering-ai-engineer
- engineering-api-platform-engineer
- engineering-ats-validator-architect
- engineering-autonomous-optimization-architect
- engineering-backend-architect
- engineering-china-network-engineer
- engineering-cms-developer
- engineering-code-reviewer
- engineering-codebase-onboarding-engineer
- engineering-data-engineer
- engineering-data-visualization-engineer
- engineering-database-optimizer
- engineering-database-reliability-engineer
- engineering-desktop-app-engineer
- engineering-developer-tooling-engineer
- engineering-devops-automator
- engineering-drupal-performance
- engineering-drupal-shopping-cart
- engineering-email-intelligence-engineer
- engineering-embedded-firmware-engineer
- engineering-feishu-integration-developer
- engineering-filament-optimization-specialist
- engineering-finops-engineer
- engineering-frontend-developer
- engineering-gaussdb-expert
- engineering-git-workflow-master
- engineering-i18n-engineer
- engineering-identity-access-engineer
- engineering-incident-response-commander
- engineering-iot-fleet-engineer
- engineering-it-service-manager
- engineering-knowledge-graph-engineer
- engineering-llm-post-training-engineer
- engineering-minimal-change-engineer
- engineering-mobile-app-builder
- engineering-mobile-release-engineer
- engineering-multi-agent-systems-architect
- engineering-network-engineer
- engineering-orgscript-engineer
- engineering-payments-billing-engineer
- engineering-pdf-engine-architect
- engineering-platform-engineer
- engineering-privacy-engineer
- engineering-prompt-engineer
- engineering-rag-pipeline-engineer
- engineering-rapid-prototyper
- engineering-realtime-collaboration-engineer
- engineering-rust-refactoring-specialist
- engineering-search-relevance-engineer
- engineering-section-508-specialist
- engineering-senior-developer
- engineering-servicenow-developer-mentor
- engineering-software-architect
- engineering-solidity-smart-contract-engineer
- engineering-sre
- engineering-technical-writer
- engineering-universal-document-compiler
- engineering-uswds-developer
- engineering-video-streaming-engineer
- engineering-voice-ai-integration-engineer
- engineering-webassembly-engineer
- engineering-wechat-mini-program-developer
- engineering-wordpress-performance
- engineering-wordpress-shopping-cart

### examples (5)
- nexus-spatial-discovery
- workflow-book-chapter
- workflow-landing-page
- workflow-startup-mvp
- workflow-with-memory

### finance (5)
- finance-bookkeeper-controller
- finance-financial-analyst
- finance-fpa-analyst
- finance-investment-researcher
- finance-tax-strategist

### game-development (21)
- blender-addon-engineer
- economy-designer
- game-audio-engineer
- game-designer
- godot-gameplay-scripter
- godot-multiplayer-engineer
- godot-shader-developer
- level-designer
- narrative-designer
- roblox-avatar-creator
- roblox-experience-designer
- roblox-systems-scripter
- technical-artist
- unity-architect
- unity-editor-tool-developer
- unity-multiplayer-engineer
- unity-shader-graph-artist
- unreal-multiplayer-architect
- unreal-systems-engineer
- unreal-technical-artist
- unreal-world-builder

### gis (13)
- gis-3d-scene-developer
- gis-analyst
- gis-bim-specialist
- gis-cartography-designer
- gis-drone-reality-mapping
- gis-geoai-ml-engineer
- gis-geoprocessing-specialist
- gis-qa-engineer
- gis-solution-engineer
- gis-spatial-data-engineer
- gis-spatial-data-scientist
- gis-technical-consultant
- gis-web-gis-developer

### healthcare (3)
- healthcare-clinical-evidence-agent
- healthcare-innovation-strategist
- healthcare-sovereign-health-systems-agent

### integrations (1)
- backend-architect-with-memory

### marketing (37)
- marketing-aeo-foundations
- marketing-agentic-search-optimizer
- marketing-ai-citation-strategist
- marketing-app-store-optimizer
- marketing-baidu-seo-specialist
- marketing-bilibili-content-strategist
- marketing-book-co-author
- marketing-carousel-growth-engine
- marketing-china-ecommerce-operator
- marketing-china-market-localization-strategist
- marketing-content-creator
- marketing-cross-border-ecommerce
- marketing-developer-community-builder
- marketing-douyin-strategist
- marketing-email-strategist
- marketing-global-podcast-strategist
- marketing-growth-hacker
- marketing-instagram-curator
- marketing-kuaishou-strategist
- marketing-linkedin-content-creator
- marketing-livestream-commerce-coach
- marketing-multi-platform-publisher
- marketing-podcast-strategist
- marketing-pr-communications-manager
- marketing-private-domain-operator
- marketing-reddit-community-builder
- marketing-seo-specialist
- marketing-short-video-editing-coach
- marketing-social-media-strategist
- marketing-tiktok-strategist
- marketing-twitter-engager
- marketing-video-optimization-specialist
- marketing-wechat-official-account
- marketing-weibo-strategist
- marketing-x-twitter-intelligence-analyst
- marketing-xiaohongshu-specialist
- marketing-zhihu-strategist

### paid-media (7)
- paid-media-auditor
- paid-media-creative-strategist
- paid-media-paid-social-strategist
- paid-media-ppc-strategist
- paid-media-programmatic-buyer
- paid-media-search-query-analyst
- paid-media-tracking-specialist

### product (6)
- product-behavioral-nudge-engine
- product-dx-engineer
- product-feedback-synthesizer
- product-manager
- product-sprint-prioritizer
- product-trend-researcher

### project-management (7)
- project-management-experiment-tracker
- project-management-jira-workflow-steward
- project-management-meeting-notes-specialist
- project-management-project-shepherd
- project-management-studio-operations
- project-management-studio-producer
- project-manager-senior

### research (1)
- research-synthesist

### sales (9)
- sales-account-strategist
- sales-coach
- sales-deal-strategist
- sales-discovery-coach
- sales-engineer
- sales-offer-lead-gen-strategist
- sales-outbound-strategist
- sales-pipeline-analyst
- sales-proposal-strategist

### security (12)
- security-ai-generated-code-auditor
- security-appsec-engineer
- security-architect
- security-blockchain-security-auditor
- security-cloud-security-architect
- security-compliance-auditor
- security-incident-responder
- security-penetration-tester
- security-secrets-credential-engineer
- security-senior-secops
- security-threat-detection-engineer
- security-threat-intelligence-analyst

### spatial-computing (6)
- macos-spatial-metal-engineer
- terminal-integration-specialist
- visionos-spatial-engineer
- xr-cockpit-interaction-specialist
- xr-immersive-developer
- xr-interface-architect

### specialized (59)
- accounts-payable-agent
- agentic-identity-trust
- agents-orchestrator
- automation-governance-architect
- business-strategist
- change-management-consultant
- chief-financial-officer
- corporate-training-designer
- customer-service
- customer-success-manager
- data-consolidation-agent
- data-privacy-officer
- esg-sustainability-officer
- government-digital-presales-consultant
- grant-writer
- healthcare-aging-parent-care-companion
- healthcare-customer-service
- healthcare-marketing-compliance
- hospitality-guest-services
- hr-onboarding
- identity-graph-operator
- language-translator
- legal-billing-time-tracking
- legal-client-intake
- legal-document-review
- loan-officer-assistant
- lsp-index-engineer
- ma-integration-manager
- medical-billing-coding-specialist
- operations-manager
- organizational-psychologist
- personal-growth-mentor
- real-estate-buyer-seller
- recruitment-specialist
- report-distribution-agent
- resume-tailor
- retail-customer-returns
- sales-data-extraction-agent
- sales-outreach
- specialized-chief-of-staff
- specialized-civil-engineer
- specialized-codebase-archaeologist
- specialized-cultural-intelligence-strategist
- specialized-developer-advocate
- specialized-document-generator
- specialized-fedramp-rmf-compliance
- specialized-focus-music-architect
- specialized-french-consulting-market
- specialized-korean-business-navigator
- specialized-master-plan-architect
- specialized-mcp-builder
- specialized-model-qa
- specialized-pricing-analyst
- specialized-salesforce-architect
- specialized-strategy-duel-agent
- specialized-workflow-architect
- study-abroad-advisor
- supply-chain-strategist
- zk-steward

### strategy (16)
- EXECUTIVE-BRIEF
- QUICKSTART
- agent-activation-prompts
- handoff-templates
- nexus-strategy
- phase-0-discovery
- phase-1-strategy
- phase-2-foundation
- phase-3-build
- phase-4-hardening
- phase-5-launch
- phase-6-operate
- scenario-enterprise-feature
- scenario-incident-response
- scenario-marketing-campaign
- scenario-startup-mvp

### support (6)
- support-analytics-reporter
- support-executive-summary-generator
- support-finance-tracker
- support-infrastructure-maintainer
- support-legal-compliance-checker
- support-support-responder

### testing (9)
- testing-accessibility-auditor
- testing-api-tester
- testing-evidence-collector
- testing-performance-benchmarker
- testing-reality-checker
- testing-test-automation-engineer
- testing-test-results-analyzer
- testing-tool-evaluator
- testing-workflow-optimizer

## ComfyUI — aplikasi (bukan paket skill)
https://github.com/Comfy-Org/ComfyUI — node-based image/video generation.
Yang bisa dipakai sebagai "skill" untuk kantor:
- `default_workflow.json` — contoh workflow bawaan
- `script_examples/` — contoh pemakaian API (basic, websockets)
- `custom_nodes/` — titik ekstensi node
- `comfy_api_nodes/` — definisi API node

> Catatan: ComfyUI butuh runtime sendiri (Python + model + GPU idealnya). Tidak di-install — hanya workflow/API-nya yang dikatalogkan untuk integrasi nanti.

---
## Ringkasan

| Repo | Jumlah |
|---|---|
| ai-memory | 20 |
| anti-slop | 6 |
| agents | 185 |
| knowledge-work-plugins | 252 |
| autoclip | 2 |
| cinematic-shot | 1 |
| agency-agents (definisi agen) | 304 |
| ComfyUI | aplikasi (workflow + API) |

**Total: 466 SKILL.md + 304 definisi agen**