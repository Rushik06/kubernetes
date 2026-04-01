function fib(n: number): number {
  if (n <= 1) {
    return n;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}

for (let n = 1; n <= 100; n += 2) {
  console.time(`fib(${n})`);
  fib(n);
  console.timeEnd(`fib(${n})`);
}
