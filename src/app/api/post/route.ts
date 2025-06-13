import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function GET(req: Request) {
    // TODO : récupérer l'id de l'utilisateur 

    // TODO : vérifier que l'utilisateur est authentifié / existe en DB
    
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const date = searchParams.get('date');
    const category = searchParams.get('category');

    const where: any = {};
    if (userId) {
        where.userId = userId;
    }
    if (date) {
        where.date = new Date(date);
    }
    if (category) {
        where.category = category;
    }
    try {
        const result = await db.post.findMany({
            where,
            orderBy: {
                datetime: 'desc',
            },
            include: {
                user: true,
                comments: true,
            },
        })
        return NextResponse.json({ result }, { status: 200 })

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }
        return NextResponse.json({ message: String(error) }, { status: 500 })
    }
}