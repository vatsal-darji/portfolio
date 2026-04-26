---
title: "The Dual Write Problem and the Transactional Outbox Pattern: A Guide to Data Consistency"
date: 2026-04-26
excerpt: "A practical walkthrough of the dual write problem, the transactional outbox pattern, CDC, and the edge cases that make distributed systems hard."
tags:
  - distributed-systems
  - data-consistency
  - postgres
  - queues
  - backend
---

Fear of job market has led me to the concepts I would not have learned otherwise at 5 in the morning. So I recently decided to build a task queue (like BullMQ or RabbitMQ) entirely from scratch. No libraries, just me trying to understand the internals of distributed systems.

I thought the logic was simple. When a user places an order, I need to:

- Save the order to Postgres.
- Publish a job to the Queue so the warehouse starts packing.

But as I dug deeper, I discovered I had walked into a classic distributed systems trap: The Dual Write Problem. And then I learned about how to overcome it. And thought maybe I'd share this if it may help you somehow or maybe just fun piece of information if you are passionate about backend and understanding how these systems work underneath.

## Phase 1: The "Ghost Data" Trap

My initial code looked something like this:

```ts
await db.saveOrder(order);
await queue.publish(job);
```

The Problem: Databases and Queues live in different worlds.

If my server crashes after Step 1 but before Step 2, the user has paid, but the order never reaches the warehouse.
If I swap them and the DB save fails, I ship a free product with no record of the order.
You cannot try/catch a power outage. I needed a way to guarantee that either both happen, or neither happens.

## Phase 2: The Outbox Pattern

I learned that the solution is to "cheat" by writing to only one place: The Database.

I created a second table called Outbox. When an order comes in, I open a SQL Transaction:

```sql
BEGIN TRANSACTION;

-- 1. Your normal business operation
INSERT INTO Orders (customer_id, total_amount, status, created_at)
VALUES ('cust-123', 299.99, 'COMPLETED', NOW());

-- Get the generated order ID (depends on your DB)
-- Example for PostgreSQL:
-- DECLARE @order_id BIGINT = LASTVAL();

-- 2. Insert the outbox event in the SAME transaction
INSERT INTO Outbox (
    id,          -- usually a UUID
    aggregate_type,
    aggregate_id,
    event_type,
    payload,
    created_at,
    status
)
VALUES (
    gen_random_uuid(),          -- or NEWID() in SQL Server
    'Order',
    LASTVAL(),                  -- or SCOPE_IDENTITY() in SQL Server
    'OrderCreated',
    '{ "orderId": 123, "customerId": "cust-123", "total": 299.99 }'::jsonb,
    NOW(),
    'PENDING'
);

-- 3. Commit - this guarantees atomicity
COMMIT;
```

Because of ACID properties, this is atomic. It is mathematically impossible to have an order without a corresponding message in the Outbox.

I then wrote a "Publisher" script that constantly polled the DB:

```sql
SELECT * FROM Outbox
WHERE status = 'PENDING'
ORDER BY created_at ASC
LIMIT 100
FOR UPDATE SKIP LOCKED;   -- to avoid thundering herd
```

...and pushed those messages to the messaging queue.

Consistency solved! ...Or did it?!

## Phase 3: The Polling Trap (Performance)

My Publisher was running a `while(true)` loop, querying the database every 50ms.

Result: I was spamming my database with thousands of queries per minute, mostly getting empty results.

The Fix: Change Data Capture (CDC) / Log Tailing.

Instead of polling the DB constantly ("Do you have data?") with some research I found out, switching to a "Push" model is an optimum solution. In the real world, CDC tools like Debezium read the Database's internal Write-Ahead Log (WAL).

Every database (Postgres, MySQL, etc.) has a hidden "log file" called WAL (in Postgres) or binlog (in MySQL). This log records every single change safely (it's used for backups and replication).

CDC tools just read this log (without slowing down your main database) and send the changes to somewhere else, for our case the publisher!

## Phase 4: The Reality Check (Edge Cases)

Just when I thought I was done, I learned that "Production-Ready" means handling the edge cases that tutorials ignore:

### 1. The Duplicate Nightmare (At-Least-Once Delivery)

If my Publisher sends a message to RabbitMQ but crashes before it can delete the row from the Outbox table, it will restart and send the message again.

The Fix: You cannot prevent this. You must handle it on the Consumer side. You have to implement Idempotency Keys if the consumer sees an Order ID it has already processed, it ignores it.

### 2. Database Bloat

Using a SQL table as a Queue causes high "churn" (lots of Inserts/Deletes), which leads to disk fragmentation and slows down the DB.

The Fix: Instead of deleting rows immediately, mark them PROCESSED and run a batch job at night to delete them in bulk (or use Table Partitioning).

## The Takeaway

Building from scratch taught me that Reliability is a trade-off.

Easy Way: `db.save() + queue.send()` -> Risk of Data Loss.
Hard Way: `Outbox + CDC + Idempotency` -> Guarantees Consistency, but adds complexity.

If you are working on critical systems (payments, orders), look up the Outbox Pattern. It saves lives (and data).
