import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg; 
dotenv.config(); 

const pool = new Pool({
    connectionString: process.env.TOKEN_ACCESS_DATABASE
});

export default pool;
