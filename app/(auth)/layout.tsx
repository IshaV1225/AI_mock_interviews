// Common layout for all Auth pages

import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'


const AuthLayout = async ({ children }: {children: ReactNode}) => {
  
  // Check if user has been authethicated
  const isUserAuthenticated = await isAuthenticated();

  console.log("Auth layout answer: " + isUserAuthenticated)
  if (isUserAuthenticated) redirect('/');

  return (
    <div className="auth-layout"> { children } </div>
  )
}

export default AuthLayout