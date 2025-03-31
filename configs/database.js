import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: String(process.env.POSTGRES_PASSWORD), 
    port: Number(process.env.POSTGRES_PORT) 
});

export default pool; 