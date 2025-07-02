import { respondError, respondSuccess } from '@/lib/server/api/response';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Accéder à l'en-tête x-user-id
        const userId = req.headers.get('x-user-id');

        // Effectuer des vérifications de santé ici
        // Par exemple, vérifier la connexion à la base de données, etc.

        // Répondre avec un statut 200 si tout est OK
        return NextResponse.json(respondSuccess({ userId }, "Service is healthy"));
    } catch (error) {
        // En cas d'erreur, répondre avec un statut 500
        return NextResponse.json(respondError('Service is unhealthy')
        );
    }
}
