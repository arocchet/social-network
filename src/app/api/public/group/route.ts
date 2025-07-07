import { NextRequest, NextResponse } from "next/server";
import { createGroupInDb } from "@/lib/db/queries/group/createGroup";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userIds, title } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
      return NextResponse.json(
        { error: "Au moins deux membres sont requis pour un groupe." },
        { status: 400 }
      );
    }

    return await createGroupInDb(userIds, title);
  } catch (error) {
    console.error("Erreur lors de la création du groupe :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du groupe." },
      { status: 500 }
    );
  }
}