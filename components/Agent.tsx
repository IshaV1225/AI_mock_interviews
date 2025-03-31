/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';  //rendered on client side

import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from '@/constants';

// define multiple values for call states
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant'
    content: string;
}

const Agents = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    
    // Handle states of the call and messages 
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]); 

    // useEffect with empty dependency array, runs once on mount, baseline functions of what happens
    // Tells application what to do when certain states with vapi get triggered
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        // Change message status
        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final'){
                const newMessage = { role: message.role, content: message.transcript }

                // add new message to the list of messages array
                setMessages((prev) => [...prev, newMessage]);
            }
        }

        const onSpeechStart = () => {
            console.log("Speech Start")
            setIsSpeaking(true);
        } 
        const onSpeechEnd = () => { 
            console.log("Speech Ended")
            setIsSpeaking(false);
        }

        console.log("BREAK STATEMENT___ERROR LINE NEXT")
        const onError = (error: Error) => console.log('Error', error);

        // Handle Vapi listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);
        
        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, [])

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generate Feedback here.')

        // TODO: Create server action that generates feedback
        const { success, id } = {
            success: true,
            id: 'feedback-id'
        }

        if(success && id){
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            console.log('Error saving feedback')
            router.push('/')
        }
    }
    


    // useEffect executed when changes occur to [messages, callStatus, type, userId]
    useEffect(() => {
        if(callStatus === CallStatus.FINISHED){
            if(type === 'generate'){
                router.push('/')
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId])

    
    // Connect Call to Vapi Agent (Harry)
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if(type == 'generate') {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId,
                }
            })
        } else {
            let formattedQuestions = '';
            if (questions) {
                formattedQuestions = questions
                    .map((question)=> `-${question}`)
                    .join('\n');
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            })
        }

    }

    // Disconnect call with Vapi Agent (Harry)
    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop();
    }

    // Get the latest message from the messages array
    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


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
                        <p key={latestMessage} className={cn('transcript-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}


            {/** Call and End Call buttons based on status */}
            <div className='w-full flex justify-center'>
                
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call' onClick={handleCall}>
                        <span className= {cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />
                        
                        {/** Show Status of call */}
                        <span>
                            {isCallInactiveOrFinished ? 'Call' : '. . .'} 
                        </span>
                           
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={handleDisconnect}>
                        End
                    </button>
                )

                }
            </div>
        </>
    )
}

export default Agents