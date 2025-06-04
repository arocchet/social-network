const { execSync } = require('child_process');
require('dotenv').config();

module.exports = async () => {
    console.log('*** globalSetup: création du schéma de la DB ***');
    console.log('DATABASE_TEST_URL:', process.env.DATABASE_TEST_URL);

    execSync('npx prisma db push --force-reset', {
        stdio: 'inherit',
        env: {
            ...process.env,
            DATABASE_URL: process.env.DATABASE_TEST_URL,
        },
    });

    console.log('Schéma de test créé.');
};