---
title: "Why Deleting Data in Postgres Doesn’t Actually Free Up Your Disk Space"
date: 2026-01-28
excerpt: "Why deleted rows in PostgreSQL still occupy disk space, how VACUUM works, and why wraparound protection matters."
tags:
  - postgres
  - database
  - data
---

If you’ve permanently deleted data from PostgreSQL and thought, "Okay, it’s gone now," well, you are wrong!

Postgres doesn't truly delete the data; it simply marks it as dead and hides it. This hidden data stays on your disk, holding up space and slowing down queries.

## The Notebook Analogy

Imagine writing a name in a notebook with a pen. To update it, you cross out the old name and write the new one at the bottom. The old name still holds the space. Over time, you scratch out hundreds of names, it takes you a long time to search page by page.

That is where Vacuuming comes in. Vacuuming acts as a garbage collector for the database, clearing out the dead tuples so the storage can be used again. This maintenance is essential because PostgreSQL uses MVCC (Multi-Version Concurrency Control).

## The Two Types of Vacuuming

### 1. Automatic/Standard Vacuum: The Housekeeper

This process clears out the dead data inside the table.

## The Bookshelf Analogy

Imagine a 2 meter bookshelf. When you remove unneeded books (dead data), there is empty space. This empty space will be used to add new books, but the physical bookshelf size (File Size) does not shrink, it didn't free up any more space in the room (the OS).

Result: The file size remains the same. Only Postgres can reuse the cleaned space in the future.

```text
[Data] [____] [Data] [____] [Data] [____] [Data] [____]
|------------------ FILE SIZE: 100 MB ------------------|
```

### 2. VACUUM FULL: The Renovator

This rigorously cleans and compacts the table, freeing up space to the Operating System (OS).

## The Bookshelf Analogy

You take all the books out of the old bookshelf, make a new, smaller bookshelf that perfectly fits the books, and throw the old one away.

Result: The new file size is smaller, and the OS gains back disk space.

```text
[Data] [Data] [Data] [Data]
|---- FILE SIZE: 50 MB ----|
```

## Why Not Always Use VACUUM FULL?

Full Vacuum seems better, but it has severe drawbacks:

1. Exclusive Lock : It locks the entire table while it creates the new file and copies the data. No one can access the table, meaning your website will freeze while the process runs.
2. Double Space Requirement : For a short time, the system needs space for both the old table and the new one. If your storage is 99% full, VACUUM FULL will fail immediately because it can't create the copy.

## The Life-Saving Role: Preventing Wraparound

Vacuuming isn't just about space; it's about time.

Every transaction gets a unique Transaction ID (XID), a 32-bit number limited to about 4 billion.

## The Circular Clock Analogy

Imagine a clock face where the hours represent your Transaction IDs (XIDs), but instead of 12 hours, this clock only has 100 hours (IDs 0 to 99).

The Problem: The clock can only keep track of 100 transactions before it resets.
The Rule: The database determines if a transaction is "old" or "new" by looking backward or forward a certain distance on the clock face. It assumes the closest path is the correct one.

## The Solution: XID Freezing

Vacuuming prevents this by Freezing old transactions. When a row's XID gets very old (approaching 200 million transactions), autovacuum runs a freeze operation. This replaces the specific XID with a special "Frozen XID" flag, effectively marking the row as "infinitely old" and "always visible."

The Takeaway: If Auto vacuum fails to keep up with freezing, Postgres will eventually shut down completely to prevent catastrophic data corruption.

Never disable Auto vacuum. Monitor its activity and ensure it has the resources to run, especially on tables with high delete/update rates.
