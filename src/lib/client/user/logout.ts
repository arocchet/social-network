export async function logout(): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/public/auth/logout', { method: 'POST' });
        if (!response.ok) {
            const data = await response.json();
            return { success: false, error: data.error || 'Logout failed' };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message || 'Network error' };
    }
}