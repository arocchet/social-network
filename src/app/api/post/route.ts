import { db } from "@/lib/db";
import { NextResponse } from "next/server";

import { z } from "zod";

const PostSchema = z.strictObject({
  content: z.string().min(1, "Content is required"),
  img: z.string().url("Image must be a valid URL"),
});

export async function POST(req: Request) {

  // Récupération des données du corps de la requête
  const { data } = await req.json()

  // Validation des données avec Zod
  const parseData = PostSchema.safeParse(data);

  console.log("Parsed Data:", parseData);

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
      userId: "cmbqn7ofd00006dq8u89tefjd",
    }
  })

  return NextResponse.json({ message: res, }, { status: 200 })
}
