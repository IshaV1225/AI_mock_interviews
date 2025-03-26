/* eslint-disable @typescript-eslint/no-unused-vars */
import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'


const initFirebaseAdmin = () => {
    const apps = getApps();

    // Do checks so we dont initialize the firebase admin more than once in development or productions
    // Ensures only one instance of firebase sdk is created
    // ADMIN (Server Side Firestore)
    if(!apps.length){
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        })
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin()

