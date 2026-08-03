import React from 'react'

export const GoodComponent = ({ scrollY }) => {
  return (
    <div style={{ transform: `translateY(${scrollY}px)` }}>
      Content
    </div>
  )
}
