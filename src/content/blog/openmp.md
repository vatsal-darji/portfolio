---
title: "OpenMP and the Fork-Join Model: Learning Shared-Memory Parallelism"
date: 2026-04-26
excerpt: "Notes from learning OpenMP, multi-core execution, the fork-join model, and why race conditions matter in shared-memory programming."
tags:
  - openmp
  - operating-systems
  - parallel-programming
  - c
  - backend
---

For the past few days, I have been studying low-level OS concepts. T	here I have wondered how the computer works so fast with multiple cores and how does it get optimised.

For that I have been studying about openMP (Open Multi-Processing). It is the de facto standard for shared memory parallel programming. Normally a program runs sequentially :

Task 1 → Task 2 → Task 3 → Task 4

But with the modern CPUs have multiple cores, openMP allows you to spilt that task into multiple threads, so it would look like this:
Core1: Task1
Core2: Task2
Core3: Task3
Core4: Task4

This can significantly reduce the execution time for compute-heavy programs.

OpenMP originally works on “The Fork Join Method”. So when the program starts there is only one main thread, but after the parallel region in the code, it forks into multiple threads, and once the once the heavy-lifting is done it joins back into that main single thread.

Here is how it works compared to the normal code:

## Normal Code:

```c
#include <stdio.h>

int main() {
  for(int i = 0; i < 5; i++) {
    printf("Iteration %d\n", i);
  }
  return 0;
}
```

Output:

```text
Iteration 0
Iteration 1
Iteration 2
Iteration 3
Iteration 4
```

## Code with OpenMP:

```c
#include <stdio.h>
#include <omp.h>

int main() {

#pragma omp parallel
  {
    int id = omp_get_thread_num();
    printf("Hello from thread %d\n", id);
  }

  return 0;
}
```

Output:

```text
Hello from thread 2
Hello from thread 4
Hello from thread 3
Hello from thread 5
Hello from thread 1
Hello from thread 8
Hello from thread 6
Hello from thread 7
Hello from thread 0
Hello from thread 9
```

Here just by including `#pragma omp parallel`, we can work multiple threads to this task, where each thread executes the block.The magic of OpenMP lies in compiler directives (`#pragma omp`). It’s fascinating how you can take existing, sequential C code and incrementally parallelize a massive for loop with just a single line of text, without needing to rewrite your entire architecture.

In distributed systems, we worry about network partitions and message delivery. In shared-memory space, our biggest enemy is the race condition. Getting hands-on with clauses like `shared`, `private`, and `reduction` to strictly control which thread owns or modifies which piece of data has given me a profound appreciation for compiler-level synchronization.

Moving from the single-threaded asynchronous nature of Node.js to manually managing thread execution and shared memory boundaries has been challenging, but it is deeply rewarding. It strips away the abstractions and forces you to think about how the CPU actually processes your loops.

I am currently exploring this area I never looked at and I will be sharing my learnings. If anyone else is exploring this area and want to add something I’d love to connect.
