import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


// Supporte DATABASE_URL (Clever Cloud) ou variables séparées
const dbUrl = process.env.DATABASE_URL;
const sequelize = dbUrl
? new Sequelize(dbUrl, {
dialect: 'mysql',
dialectOptions: {
// activez ssl si votre instance l'exige
// ssl: { require: true }
},
logging: false,
})
: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
host: process.env.DB_HOST,
port: process.env.DB_PORT || 3306,
dialect: 'mysql',
logging: false,
});


export default sequelize;