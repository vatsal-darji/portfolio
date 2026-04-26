---
title: "The dreaded Redis MOVED error and why read replicas will break your AWS job queues."
date: 2026-04-26
excerpt: "Why Redis Cluster returns MOVED errors, how to fix ElastiCache clients with IORedis.Cluster, and why BullMQ should avoid replica reads."
tags:
  - redis
  - aws
  - elasticache
  - bullmq
  - backend
---

Recently, while deploying a background job queue to AWS using ElastiCache, I hit a massive roadblock. Our Node.js queue workers suddenly started crashing with a cryptic log: `MOVED 4443 10.x.x.x:6379`.

Here is a breakdown of why this happens and how to fix it:

## The Problem: Standalone vs. Cluster Clients

Our codebase was using a standard, standalone Redis client (`new IORedis(...)`). But in AWS, our ElastiCache instance was set up as a Redis Cluster, where data is partitioned across multiple nodes using 16,384 hash slots. When our queue tried to access a key on the wrong node, the server replied with a `MOVED` redirect. Because the standalone client isn't "cluster-aware," it didn't know how to follow the redirect and simply threw an error.

## The Fix: Dynamic Cluster Connections (See the screenshot!)

The first step was refactoring our connection utility to use `IORedis.Cluster`, passing in the AWS Configuration Endpoint (the one starting with `clustercfg`, not a specific node!). This allows the client to automatically map the hash slots and route requests correctly on startup.

![Redis cluster connection utility screenshot](/public/redis-error.png)

## The Catch: Read Replicas & BullMQ

During the fix, I caught something critical. When configuring a cluster, it’s tempting to enable read replicas (`scaleReads: 'slave'`) to boost performance. Do not do this if you are using BullMQ. Queue workers rely on complex Lua scripts and atomic operations to manage job states. If a worker reads from a replica that is even a few milliseconds behind the primary node, it gets stale data, leading to race conditions and a corrupted queue state. All reads and writes must go to the primary node for that specific hash slot.

Sometimes the biggest infrastructure lessons come from a single line in an error log.
