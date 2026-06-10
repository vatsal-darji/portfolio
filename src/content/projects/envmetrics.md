---
title: "envmetrics"
description: "A Node.js library that fixes a silent bug in containerized apps where os.totalmem() reports host RAM instead of container limits, reading cgroup kernel files directly for accurate memory metrics."
tech:
  - TypeScript
  - Node.js
  - Docker
  - cgroups
  - ESM
github: "https://lnkd.in/gtdzDByx"
npm: "https://lnkd.in/gHWpUbVY"
featured: true
---

A zero-dependency Node.js library that fixes a silent, widespread bug in containerized apps: `os.totalmem()` returns the host machine's RAM even when the container has a hard memory cap, causing autoscalers and health checks to act on completely wrong data.

## The problem

When Node.js runs inside a Docker container capped at 256 MB, calling `os.totalmem()` returns the host's 16 GB. The OS API has no awareness of cgroup limits. Any logic that relies on this — memory-based autoscaling, health check thresholds, load shedding — is silently operating on a number that's off by an order of magnitude.

## How it works

envmetrics bypasses OS APIs entirely and reads cgroup v1/v2 kernel files directly — the same source Docker and Kubernetes use to enforce limits. It returns normalized usage fractions (0–1) alongside a `confidence` field so callers know exactly how much to trust the numbers depending on whether a limit was detected.

## What it demonstrates

- Direct kernel file reads from `/sys/fs/cgroup` for both cgroup v1 and v2
- TypeScript with full ESM support and zero runtime dependencies
- Docker-based integration test suite that enforces real container limits rather than mocking syscalls
- Published to npm and open source on GitHub

## Links

- [npm package](https://lnkd.in/gHWpUbVY)
- [GitHub](https://lnkd.in/gtdzDByx)
