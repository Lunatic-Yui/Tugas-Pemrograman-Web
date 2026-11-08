const { execSync } = require('child_process');

module.exports = async () => {
  execSync('npx prisma db push --skip-generate --force-reset', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' }
  });
};
