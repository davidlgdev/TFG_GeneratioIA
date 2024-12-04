import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import AIRoutes from './routes/AIRoutes.js';
import databaseRoutes from './routes/databaseRoutes.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import crypto from 'crypto'
dotenv.config();

const app = express();
const port = 3001; 

const privateKey = fs.readFileSync('private.pem', 'utf8'); 
const publicKey = fs.readFileSync('public.pem', 'utf8'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/authorize', (req, res) => {
  console.log(req.body); 
  const clientId = req.body.client_id 
  const loginHint = req.body.login_hint
  const authorizationCode = crypto.randomBytes(32).toString('hex');
  const redirectUri = req.body.redirect_uri;
  const state = req.body.state;
  console.log(req.body.redirect_uri);
  
  console.log("redirecting...");
  res.redirect('/launch');
});
app.post('/launch', (req, res) => {
    console.log("POST launch endpoint");
    
    const idToken = req.body.id_token; 
  
    if (!idToken) {
      console.error('id_token no encontrado en la solicitud');
      return res.status(400).send('id_token no encontrado');
    }
  
    try {
      const decoded = jwt.verify(idToken, publicKey, { algorithms: ['RS256'] });
  
      if (decoded.iss !== 'http://localhost/moodle') { 
        throw new Error('Emisor no valido');
      }
  
      const userId = decoded.sub;
      const courseName = decoded['https://purl.imsglobal.org/spec/lti/claim/context'].label; 
  
      res.send('LTI exito'); 
  
    } catch (error) {
      console.error('Error:', error);
      res.status(401).send('Error en la validación del JWT');
    }
});
app.get('/launch', (req, res) => { 
  res.json([
    {
      "client_id": "SRiEZ3Drnhs2j7Y", 
      "login_hint": "2", 
      "redirect_uri": "https://e2b2-81-184-197-163.ngrok-free.app/launch",
      "nonce": "a1b2c3d4e5f6", 
      "state": "xyz789" 
    }
  ])

})
  app.get('/jwks', (req, res) => { 
  console.log("get jwks");
  res.json({ 
    keys: [{
      alg: 'RS256',
      kty: 'RSA',
      use: 'sig',
      x5c: [publicKey] 
    }]
  });
});

app.use('/api/AIGeneration', AIRoutes);
app.use('/api/saveToDatabase', databaseRoutes);

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