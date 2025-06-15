import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db/queries/post/getAllPosts';

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les posts avec les informations de l'utilisateur
    const posts = await getAllPosts();
    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des posts'
      },
      { status: 500 }
    );
  }
}