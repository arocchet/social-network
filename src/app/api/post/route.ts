import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { z } from "zod";

const PostSchema = z.strictObject({
  content: z.string().min(1, "Content is required"),
  img: z.string().optional(),
});

export async function POST(req: Request) {
  // Récupère le token depuis les cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "You must be connected." },
      { status: 401 }
    );
  }

  // Décode le token pour obtenir l'id utilisateur
  const payload = await verifyJwt(token);
  const userId = payload?.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "You must be connected." },
      { status: 401 }
    );
  }

  // Récupération des données du corps de la requête
  const { data } = await req.json();

  // Validation des données avec Zod
  const parseData = PostSchema.safeParse(data);

  // Vérification si la validation a échoué
  if (!parseData.success) {
    return NextResponse.json(
      { message: parseData.error.errors.map((err) => err.message).join(", ") },
      { status: 400 }
    );
  }

  // Si la validation réussit, création de post
  const res = await db.post.create({
    data: {
      message: parseData.data.content,
      image: parseData.data.img,
      visibility: "PRIVATE",
      userId: userId,
    },
  });

  return NextResponse.json({ message: res }, { status: 200 });
}
