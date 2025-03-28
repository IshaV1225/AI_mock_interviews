/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a server rendered file
// This action file allows controls all actions regarding authentication

'use server'
import { auth, db } from "@/firebase/admin"
import { cookies } from "next/headers"


// cookie expiry in 1 week 
const ONE_WEEK = 60 * 60 * 24 * 7 * 1000

// Set up a session cookie for authenticated users
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK ,     
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

// Authenticate user with sign-up funtionality
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params

    try{
        const userRecord = await db.collection('users').doc(uid).get();
        
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        // creating a new user
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully, please sign in.'
        }

    } catch (e: any){
        console.error('Error creating a user', e)

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return{
            success: false,
            message: 'Failed to create account'
        }
    }
}

// Authenticate user with sign-in funtionality
export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'  
            }
        }

        // If user exists, set a session cookie for the user
        await setSessionCookie(idToken);


    } catch (e) {
        console.log(e)

        return {
            success: false,
            message: "Failed to log into an account."
        };
        
    }
}

// Check if a user exists. Returns the user or null based on the existence of a Session Cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) return null;
    
    try {  // Check for a Valid user 
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
       
        // Get access to the user form the database
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        
        // If there is no user
        if(!userRecord.exists) {
            return null;
        }
        
        // Return object with user record data and asign as 'User'
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (e) {
        console.log(e)
        
        return null;
    }
}


// Check if the user has been authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();

    // Use (!!) to turn the user existence (truthy / falsy value) into a boolean value.
    return (!!user);
}
