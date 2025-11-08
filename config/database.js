import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

const common = {
  dialect: 'mysql',
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
};

const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      ...common,
      dialectOptions: {
        ssl: { rejectUnauthorized: false }, // ✅ nécessaire sur Clever Cloud
      },
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      ...common,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
    });

export default sequelize;