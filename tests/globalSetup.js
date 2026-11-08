const { execSync } = require('child_process');

// Bikin tabel di database test sebelum test jalan
module.exports = async () => {
  execSync('npx prisma db push --skip-generate --force-reset', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' }
  });
};
