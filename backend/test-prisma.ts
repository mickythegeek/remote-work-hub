import { config } from 'dotenv';
config();
process.env.DATABASE_URL = 'postgresql://remoteworkhub_user:nS0DdSFiDdfanl1u3dRe6ILGNIAkg02a@dpg-d7h90p8sfn5c73ea4ac0-a.frankfurt-postgres.render.com/remoteworkhub';
process.env.PGSSLMODE = 'require';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log('connected');
  } catch (e: any) {
    console.error('DB error full', e);
    console.error('DB error message', e.message);
    console.error('DB error stack', e.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
