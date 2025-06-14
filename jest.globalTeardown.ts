const { existsSync, unlinkSync } = require('fs');
const { join } = require('path');

module.exports = async () => {
  console.log('*** globalTeardown: suppression fichier test DB ***');

  const dbFile = join(__dirname, 'prisma', 'test.db');
  if (existsSync(dbFile)) {
    unlinkSync(dbFile);
    console.log('Fichier test.db supprimé');
  } else {
    console.log('Pas de fichier test.db à supprimer');
  }
};