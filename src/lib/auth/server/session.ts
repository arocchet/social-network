import { cookies } from 'next/headers'
import { verifyJwt } from './jwt'
import { db } from '@/lib/db'

export async function getServerSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null

    const payload = await verifyJwt(token)
    if (!payload) return null

    const user = await db.user.findUnique({ where: { id: payload.userId } })
    return user
}