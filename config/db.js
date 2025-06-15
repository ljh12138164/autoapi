import knex from 'knex';
import dotenv from 'dotenv';

// 根据环境加载不同的配置文件
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}
const db = knex({
  client: 'pg',
  connection: {
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.rnzxqnmqpokuxbioynsf',
    password: 'a1668692058',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
});

export default db;
