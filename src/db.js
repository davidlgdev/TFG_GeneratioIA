import pg from 'pg';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config(); 

const pool = mariadb.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306, 
});
pool.getConnection()
    .then(conn => {
        console.log('Connected to the database');
        conn.end(); 
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

export default pool;