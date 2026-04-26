---
title: "Distributed Task Queue System"
description: "A learning project to understand distributed task queue systems and how they work under the hood."
tech:
  - TypeScript
  - Node.js
  - Redis
  - Docker
  - PostgreSQL
github: "https://github.com/vatsal-darji/distributed-task-queue-system"
featured: true
---

A distributed task engine I’m building to learn how backend systems handle task creation, queueing, storage, and reliable processing across services.

## Why build it

The goal of this project is to understand how distributed systems manage tasks efficiently at scale instead of relying on a single monolithic process. I wanted to explore how queues, persistent storage, and service communication can work together in a real backend setup.

## What it demonstrates

Build a lightweight task service with Express and TypeScript, use Redis to queue and manage jobs, and store task state in PostgreSQL for persistence and tracking. The system can then be extended with workers, retries, status updates, and scalable background processing.

## Future work

What I liked most is that it pushed me beyond basic CRUD APIs and into system design thinking. It made me think about reliability, asynchronous workflows, service coordination, and how real-world backend infrastructure is put together.
