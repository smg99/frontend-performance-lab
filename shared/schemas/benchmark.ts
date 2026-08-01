export interface BenchmarkMetric {
  name: string
  value: number | string
  unit: string
  trend?: number
  description?: string
}

export interface Benchmark {
  id: string
  title: string
  description: string
  metrics: BenchmarkMetric[]
  runnerConfig?: Record<string, unknown>
}
