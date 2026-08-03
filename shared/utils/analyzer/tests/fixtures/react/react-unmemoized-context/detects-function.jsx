import React from 'react'
import { ThemeContext } from './theme'

export const BadProvider = ({ theme, children }) => {
  return (
    <ThemeContext.Provider value={() => theme.mode}>
      {children}
    </ThemeContext.Provider>
  )
}
