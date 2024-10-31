import dotenv from "dotenv"; 
dotenv.config();

const MISTRA_TOKEN = process.env.MISTRA_TOKEN;
const model = "mistralai/Mixtral-8x7B-Instruct-v0.1"; 

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
    fetch('https://api.mistral.ai/v1/chat/completions', parameters)
    .then(response => response.json())
    .then(data => {
      console.log(data.choices[0].message.content); 
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}
export default generationQuestionAI;