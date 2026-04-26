---
title: "Maritime Document Validator"
description: "AI-powered maritime system that checks the health of crew documents with AI pipelines and verifies if that is valid or wrong."
tech:
  - TypeScript
  - Node.js
  - PostgreSQL
  - Redis
  - BullMQ
  - Gemini
  - Joi
github: "https://github.com/vatsal-darji/Smart-Maritime-Document-Extractor"
featured: true
---

AI-powered maritime document assessment backend built with TypeScript, Express, PostgreSQL, Redis, and BullMQ. It extracts structured data from seafarer documents and organizes it into sessions, jobs, and compliance reports.

## Problem

Reviewing maritime documents manually takes time and makes it easy to miss inconsistencies, missing certificates, or expiry risks. The goal was to speed up that process and make the output more reliable.

## Approach

I built an extraction pipeline that processes uploaded files, uses Gemini to pull structured data, and stores the results in a queryable database. I also added async job handling, retries, deduplication, and session-level validation/reporting.

## What I liked about this build

I like that it feels practical and production-minded, not just an LLM demo. It combines AI extraction with backend reliability, structured data design, and useful compliance-focused outputs.
