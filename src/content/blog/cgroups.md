---
title: "How Linux Uses cgroups to Stop One Process from Crashing Everything"
date: 2026-04-27
excerpt: "How cgroups let Linux enforce resource limits, prioritize workloads, track usage, and make containers possible."
tags:
  - linux
  - containers
  - docker
  - kubernetes
---

Ever wonder how Docker or Kubernetes enforce strict memory restrictions on your apps? Or how Linux prevents a single rogue process from crashing your entire server?

While researching a specific issue with the `os.totalmem()` method in Node.js, I ended up going down a fascinating rabbit hole and discovered the magic behind containerization: Control Groups, or cgroups.

If an operating system allowed any single program to access all bare-metal resources unchecked, one memory-hungry process could easily starve everything else, leading to resource exhaustion and system crashes.

This is exactly where cgroups are needed.

## What Are cgroups?

Cgroups are built directly into the Linux kernel, they allow you to partition, restrict, and manage system resources for specific processes.

## The Credit Card Analogy

Think of it like setting a strict limit on a credit card, no matter how much a program wants to spend, it simply cannot exceed the hard limit you've set.

Without cgroups, the predictable, isolated containers we rely on every day wouldn't exist!

## The Four Essential Features of cgroups

At a high level, cgroups provide four essential features that keep our modern infrastructure stable:

1. Resource limits: Caps the maximum amount of hardware (CPU, Memory, Disk I/O) a specific process or group of processes can consume.
2. Prioritization: Ensures that mission-critical workloads get access to CPU and disk time before less important background tasks.
3. Accounting: Measures and monitors exact resource usage, which is essential for billing, capacity planning, and debugging.
4. Control: Gives you the power to freeze, resume, or restart an entire group of processes as a single, manageable unit.

## Why This Matters

If you want to deep dive more into how you can setup cgroups and check for the running processes, I have found an amazing medium article by Dagang Wei, which helped me understand this concept clearly:

[https://medium.com/@weidagang/linux-beyond-the-basics-cgroups-f157d93bd755](https://medium.com/@weidagang/linux-beyond-the-basics-cgroups-f157d93bd755)
