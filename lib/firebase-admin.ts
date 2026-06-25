import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY

let db: Firestore | null = null

if (!getApps().length && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  })
}

if (getApps().length) {
  db = getFirestore()
}

export { db }
