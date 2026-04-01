//MY - NOTE:

/*This is my benchamark test where i observe the performance and respone time is exponentiaally grow upto 45
after that it silently stops AS Fibonacci recursion is O(1.618)^n which is golden ratio as  'n' increases
the time complexity will increase exponentially */

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
