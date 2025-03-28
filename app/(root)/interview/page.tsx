import Agents from '@/components/Agents'
import React from 'react'

const page = () => {
  return (
    <>
      <h3>Interview Generation</h3>

      <Agents userName="You" userId="user1" type="generate"/>
    </>
  )
} 

export default page