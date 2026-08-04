import React from 'react'

export const BadComponent = ({ scrollY }) => {
  return <div style={{ top: scrollY + 'px', left: 10 }}>Content</div>
}
