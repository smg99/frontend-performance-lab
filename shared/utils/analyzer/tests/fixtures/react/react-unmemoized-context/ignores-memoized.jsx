import React, { useMemo } from 'react'
import { AuthContext } from './auth'

export const GoodProvider = ({ user, children }) => {
  const value = useMemo(() => ({ user, loggedIn: true }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
