// Utility functions for heavy synchronous tasks

export const calculatePrimes = (limit: number): number[] => {
  const primes: number[] = []
  for (let i = 2; i <= limit; i++) {
    let isPrime = true
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) primes.push(i)
  }
  return primes
}

// Generate a massive array of random data and sort it
export const heavySort = (size: number): number[] => {
  const arr = new Float64Array(size)
  for (let i = 0; i < size; i++) {
    arr[i] = Math.random()
  }
  return Array.from(arr.sort())
}

// If running in a Web Worker context, listen for messages
if (typeof self !== 'undefined' && 'document' in self === false) {
  self.onmessage = e => {
    const { type, payload, id } = e.data

    try {
      const start = performance.now()
      let result = null

      if (type === 'primes') {
        result = calculatePrimes(payload)
      } else if (type === 'sort') {
        result = heavySort(payload)
      }

      const end = performance.now()

      self.postMessage({
        id,
        success: true,
        result,
        executionTime: end - start
      })
    } catch (error: Error | unknown) {
      self.postMessage({
        id,
        success: false,
        error: error.message
      })
    }
  }
}
