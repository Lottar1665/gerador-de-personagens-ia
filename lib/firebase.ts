import { initializeApp, getApps, type FirebaseOptions } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAseRgc68EerIkl52VyvP1bEc4TIzrszdg",
  authDomain: "gerador-de-presets-com-i-6560f.firebaseapp.com",
  projectId: "gerador-de-presets-com-i-6560f",
  storageBucket: "gerador-de-presets-com-i-6560f.firebasestorage.app",
  messagingSenderId: "505681155907",
  appId: "1:505681155907:web:1f2a1c4052eac857ec81f6",
  measurementId: "G-YRLM0X8FQ1",
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null
const auth = typeof window !== "undefined" ? getAuth(app) : null

export { app, auth, analytics, firebaseConfig }
