import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    // heavy nesting
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        for (let k = 0; k < 10; k++) {
          for (let l = 0; l < 10; l++) {
            if (i + j + k + l > 20) {
              console.log(i, j, k, l)
            }
          }
        }
      }
    }
  }, [])

  return <div>Dashboard</div>
}
