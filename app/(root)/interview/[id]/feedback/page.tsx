/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id)
  if(!interview) redirect('/');

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  //console.log(feedback);

  return (
    <section className='section-feedback'>
      
      {/** Title and Overall view of interview */}

      <div className='flex flex-row justify-center'>
        <h1 className='text-4xl font-semibold'>
          Feedback on the Interview -{" "} 
          <span className='capitalize'>{interview.role}</span> Interview
        </h1>
      </div>
      <div className='flex flex-row justify-center'>
        <div className='flex flex-row gap-5'>
          <div className='flex flex-row gap-2 items-center'>
            <Image src="/star.svg" width={22} height={22} alt='star' />
            <p>Overall Impression:{" "} 
              <span className='text-primary-200 font-bold'>
                  {feedback?.totalScore}/100
              </span>
            </p>
            <Image src="/calendar.svg" width={22} height={22} alt='star'/>
            <p >
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
                : "N/A"
              }
            </p>
          </div>
        </div>
      </div>
      
      <hr />

      <p>{feedback?.finalAssessment}</p>
      
      {/** Breakdown of interview */}
      <div className='flex flex-col gap-4'>
        {/** Map over each evaluation category (if exists) and display on page */}
        <h2>Breakdown of the Interview:</h2>
        
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className='font-bold'>
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}

        <h3>Strengths</h3>
        <ul>
        {feedback?.strengths?.map((strength, index) => (
          <li key={index}>
            {strength}
          </li>
        ))}
        </ul>          

        
        <h3>Areas for Improvement:</h3>
        <ul>
          {feedback?.areasForImprovement?.map((improvement, index) => (
            <li key={index}>
              {improvement}
            </li>
          ))}
        </ul>
      </div>

      <div className='buttons'>
          <Button className='btn-secondary flex-1'> 
            <Link href="/" className='flex w-full justify-center'>
                <p className='text-sm font-semibold text-primary-200 text-center'>
                  Back to dashboard
                </p>
            </Link>
          </Button>
          <Button className="btn-primary flex-1">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-sm font-semibold text-black text-center">
                Retake Interview
              </p>
            </Link>
          </Button>
      </div>


    </section>
  )
}

export default page