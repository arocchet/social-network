export function generateUsername(email: string): string {
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${base}${suffix}`;
}
