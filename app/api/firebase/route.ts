import { NextResponse } from "next/server"
import { initializeApp, getApps, getApp } from "firebase/app"
import { initializeFirestore, collection, getDocs, addDoc, query, orderBy } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
}

// Inicializa o Firebase Core de forma segura
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Força a conexão a usar HTTP padrão (LongPolling) apontando para o banco (default)
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "(default)")

// 1. MÉTODO GET: Responsável por listar os posts na galeria da comunidade
export async function GET() {
  try {
    if (!firebaseConfig.projectId) {
      return NextResponse.json({ error: "Erro de configuração no servidor. Verifique o arquivo .env" }, { status: 500 })
    }

    const postsRef = collection(db, "posts")
    
    // Tentamos buscar usando a ordenação padrão por data
    try {
      const q = query(postsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data()
        const { previewDataUrl, ...cleanData } = data as any
        return { id: doc.id, ...cleanData }
      })
      return NextResponse.json(posts)
    } catch (orderError) {
      console.warn("⚠️ Falha ao ordenar por data (pode ser falta de posts ou índice). Buscando dados puros...")
      // Se quebrar por falta de posts/índice, busca a coleção pura sem travar
      const querySnapshot = await getDocs(query(postsRef))
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data()
        const { previewDataUrl, ...cleanData } = data as any
        return { id: doc.id, ...cleanData }
      })
      return NextResponse.json(posts)
    }
  } catch (error: any) {
    console.error("❌ Erro fatal ao buscar dados do Firebase:", error)
    return NextResponse.json(
      { error: "Falha ao carregar posts da comunidade.", details: error.message },
      { status: 500 }
    )
  }
}

// 2. MÉTODO POST: Responsável por criar e salvar um novo post enviado pelo Dashboard
export async function POST(request: Request) {
  try {
    if (!firebaseConfig.projectId) {
      return NextResponse.json({ error: "Erro de configuração no servidor. Verifique o arquivo .env" }, { status: 500 })
    }

    const body = await request.json()
    const { uploadedBy, userPhotoUrl, result } = body

    const novoPost = {
      uploadedBy: uploadedBy || "Anônimo",
      userPhotoUrl: userPhotoUrl || "",
      result: result || null,
      createdAt: new Date().toISOString(),
    }

    const postsRef = collection(db, "posts")
    const docRef = await addDoc(postsRef, novoPost)

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Post compartilhado na comunidade com sucesso!",
    })
  } catch (error: any) {
    console.error("❌ Erro fatal ao salvar post no Firebase:", error)
    return NextResponse.json(
      { error: "Falha ao salvar o post na comunidade.", details: error.message },
      { status: 500 }
    )
  }
}
