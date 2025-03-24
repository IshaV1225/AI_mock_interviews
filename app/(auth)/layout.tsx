/* eslint-disable @typescript-eslint/no-unused-vars */
// Common layout for all Auth pages

import React, { ReactNode } from 'react'


const AuthLayout = ({ children }: {children: ReactNode}) => {
  return (
    <div className="auth-layout"> { children } </div>
  )
}

export default AuthLayout