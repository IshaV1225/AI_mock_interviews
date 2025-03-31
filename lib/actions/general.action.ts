import {db} from "@/firebase/admin";

// Function to fetch all interviews associated with the specific user
export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

    // Return each idividual document as an interview object
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
} 

// Function to fetch interviews created by all users 
export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const {userId, limit = 20} = params;
    
    const interviews = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get();

    // Return each idividual document as an interview object
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
} 

// Function to fetch a single interview based on the interview id 
export async function getInterviewsById(id: string): Promise<Interview | null> {
    const interview = await db
    .collection('interviews')
    .doc(id)
    .get();

    // Return each idividual document as an interview object
    return interview.data() as Interview | null;
} 