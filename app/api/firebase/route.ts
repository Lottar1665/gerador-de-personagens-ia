import { NextResponse } from "next/server"
import { admin, db } from "@/lib/firebase-admin"

const COLLECTION_NAME = "generatedFaces"

export async function GET() {
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get()

  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const savedDoc = await db.collection(COLLECTION_NAME).add({
    ...body,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  return NextResponse.json({ id: savedDoc.id }, { status: 201 })
}
