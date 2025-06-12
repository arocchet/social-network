import { db } from "@/lib/db";
import { NextResponse } from "next/server";

import { z } from "zod";

const PostSchema = z.strictObject({
  content: z.string().min(1, "Content is required"),
  img: z.string().optional(),
});

export async function POST(req: Request) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "You must be connected." }, { status: 401 });
  }

  // TODO : Vérification si l'utilisateur existe en DB

  // Récupération des données du corps de la requête
  const { data } = await req.json()

  // Validation des données avec Zod
  const parseData = PostSchema.safeParse(data);

  // Vérification si la validation a échoué
  if (!parseData.success) {
    return NextResponse.json({ message: parseData.error.errors.map(err => err.message).join(", ") }, { status: 400 });
  }

  // Si la validation réussit, création de post
  const res = await db.post.create({
    data: {
      message: parseData.data.content,
      image: parseData.data.img,
      visibility: "PRIVATE",
      userId: userId,
    }
  })

  return NextResponse.json({ message: res, }, { status: 200 })
}
