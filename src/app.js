import dotenv from "dotenv"; 
import readline from 'readline'; 
import express from 'express'; 
import bodyParser from 'body-parser'; 
import cors from 'cors';
import pool from './db.js'; 
//import questionRoutes from './routes/questionRoutes.js'; 
import AIRoutes from './routes/AIRoutes.js';
import databaseRoutes from './routes/databaseRoutes.js';

dotenv.config();
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/AIGeneration', AIRoutes)
app.use('api/saveToDatabase', databaseRoutes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
