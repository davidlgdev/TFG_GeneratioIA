import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './db.js';
import AIRoutes from './routes/AIRoutes.js';
import ltiRoutes from './routes/ltiRoutes.js';
import databaseRoutes from './routes/databaseRoutes.js';
import webserverMoodle from './routes/webserverMoodle.js';

dotenv.config();
const app = express();
const port = 3001; 
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/AIGeneration', AIRoutes);
app.use('/api/saveToDatabase', databaseRoutes);
app.use('/lti', ltiRoutes);
app.use('/api/webserverMoodle', webserverMoodle);

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
};

startServer();
