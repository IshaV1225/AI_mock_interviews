import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

// define multiple values for call states
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const Agents = ({ userName }: AgentProps) => {
    const callStatus = CallStatus.FINISHED;
    const isSpeaking = true;
    const messages = [
        'Whats your name?',
        'My name is John Doe, nice to meet you!'
    ];
    const lastMessage = messages[messages.length-1];

    return (
        <>
            <div className='call-view'>
                
                {/** Interviewer card  */}
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak'/>}            
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/** User card  */}
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src="/user-avatar.png" alt='user avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={lastMessage} className={cn('transcript-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}


            {/** Call and End Call buttons based on status */}
            <div className='w-full flex justify-center'>
                
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call'>
                        <span className= {cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' & 'hidden')} />
                        
                        {/** Show Status of call */}
                        <span>
                            {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .'} 
                        </span>
                           
                    </button>
                ) : (
                    <button className='btn-disconnect'>
                        End
                    </button>
                )

                }
            </div>
        </>
    )
}

export default Agents