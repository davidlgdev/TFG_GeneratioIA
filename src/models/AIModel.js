import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url); //Para leer el URL del archivo
const __dirname = dirname(__filename); // Extrae el path del directorio (quita el archivo)
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Crea un path absoluto saliendose una vez (de models al src) buscando el .env"

const MISTRA_TOKEN = process.env.MISTRA_TOKEN;
if(!MISTRA_TOKEN){
  console.log("token: MISTRA_TOKEN not found");
  
}
const generationQuestionAI = (query) => {
    const parameters = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRA_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'open-mistral-nemo',
            messages: [
                { 
                role: 'user', 
                content: query 
                }
            ]
        })
    }
    return new Promise((resolve, reject) => {
      fetch('https://api.mistral.ai/v1/chat/completions', parameters)
      .then(response => response.json())
      .then(data => {
        console.log(data.choices[0].message.content); 
        resolve(data.choices[0].message.content);
      })
      .catch(error => {
        console.error("Error: ", error);
        reject(error);
      });
    })    
}
export default generationQuestionAI;