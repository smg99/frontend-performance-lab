import React, { useEffect, useLayoutEffect } from 'react'
export function ReactBadComponent8() {
  const items = Array.from({length: 10000})
  useEffect(() => {
    window.addEventListener('scroll', () => console.log('scroll'))
  }, [])
  useLayoutEffect(() => {
    console.log(document.body.clientHeight)
  }, [])
  return (
    <div onMouseMove={() => document.body.clientWidth}>
      {items.map((_, i) => <div key={i}>{i}</div>)}
    </div>
  )
}