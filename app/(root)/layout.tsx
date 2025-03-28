import Link from 'next/link'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'

const RootLayout = async ({ children }: { children: ReactNode}) => {
 
  // Make sure user is authenticated 
  const isUserAuthenticated = await isAuthenticated();
  console.log("Value of isUserAuthenticated is: " + isUserAuthenticated)

  // original condition (!isUserAuthenticated): likely problem in isAuthenticated() function
  if (!isUserAuthenticated) {  
    console.log("New value of isUserAuthenticated is: " + !isUserAuthenticated)
    redirect("/sign-in");
  }

  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
            <Image src="/logo.svg" alt="Logo" width={38} height={32} />
            <h2 className='text-primary-100'>PrepWise</h2>
        </Link>
      </nav>
      
      {children}
    </div>
  )
}

export default RootLayout