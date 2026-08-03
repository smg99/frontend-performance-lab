import React from 'react'
import { AuthContext } from './auth'

export const BadProvider = ({ user, children }) => {
  return (
    <AuthContext.Provider value={{ user, loggedIn: true }}>
      {children}
    </AuthContext.Provider>
  )
}
