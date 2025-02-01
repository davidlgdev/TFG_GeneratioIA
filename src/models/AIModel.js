import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url); //To read the file URL
const __dirname = dirname(__filename); // Extract the directory path (remove the file)
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Create an absolute path going one level up (from models to src) and looking for the .env file

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