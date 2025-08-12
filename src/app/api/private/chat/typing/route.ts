import { NextRequest, NextResponse } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';
import { getUserByIdServer } from '@/lib/server/user/getUser';
import { UserSchemas } from '@/lib/schemas/user';

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user ID from the middleware
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get user information
    const user = await getUserByIdServer(userId, UserSchemas.Public);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    const { receiverId, conversationId, type, isTyping } = await request.json();
    
    if (type === 'direct' && !receiverId) {
      return NextResponse.json(
        { error: 'receiverId requis pour les conversations directes' },
        { status: 400 }
      );
    }
    
    if (type === 'group' && !conversationId) {
      return NextResponse.json(
        { error: 'conversationId requis pour les conversations de groupe' },
        { status: 400 }
      );
    }

    const channelId = type === 'direct' 
      ? `typing_direct_${[userId, receiverId].sort().join('_')}` 
      : `typing_group_${conversationId}`;

    const typingData = {
      type: 'typing_status',
      userId: userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isTyping,
      timestamp: new Date().toISOString(),
    };

    // Publier le statut de frappe
    await redisdb.set(`typing:${channelId}:${userId}`, JSON.stringify(typingData), {
      ex: 5, // Expire après 5 secondes
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending typing status:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
