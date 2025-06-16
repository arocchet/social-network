import { POST } from '@/app/[locale]/api/public/auth/register/route'
import { login } from '@/lib/auth/server/credentials/login'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/hash'
import { NextRequest } from 'next/server'

beforeAll(async () => {
    await db.user.create({
        data: {
            username: 'testuser',
            email: 'test@example.com',
            password: await hashPassword('password123'),
            firstName: 'Test',
            lastName: 'User',
            birthDate: new Date('1990-01-01'),
        },
    });
});

describe('POST /api/register', () => {
    it('should register user and return success', async () => {
        try {
            const uniqueSuffix = Date.now() + Math.random().toString(36).substring(2, 8)
            const uniqueEmail = `testuser_${uniqueSuffix}@example.com`

            const formData = new FormData()
            formData.append('username', `testuser_${uniqueSuffix}`)
            formData.append('email', uniqueEmail)
            formData.append('password', 'password123')
            formData.append('firstname', 'Test')
            formData.append('lastname', 'User')
            formData.append('dateOfBirth', '1990-01-01')

            const req = {
                formData: async () => formData,
            } as unknown as NextRequest

            const res = await POST(req)

            expect(res.status).toBe(200)
            const json = await res.json()
            expect(json.success).toBe(true)

        } catch (err) {
            console.error('Registration test failed:', err)
            fail(`Test failed with error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        }
    })
})


describe('POST /api/login', () => {
    it('should login user and return sucess', async () => {
        try {
            const token = await login('test@example.com', 'password123')
            expect(token).toBeTruthy();
        } catch (err) {
            console.error('Login test failed:', err)
            fail(`Test failed with error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        }
    })
})