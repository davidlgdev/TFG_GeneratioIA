import dotenv from "dotenv";
dotenv.config();

const createQuestion = async (req, res) => {
    try {
        const { questions } = req.body;
        if (!questions) {
            return res.status(400).json({
                error: 'Las preguntas no existen'
            });
        }

        const baseURL = "http://localhost/moodle/webservice/rest/server.php";
        const token = process.env.MOODLE_TOKEN_RETQUESTION;
        const functionName = "local_qbank_plugin_add_question";
        const format = "json";
        const moodleResponses = [];

        for (const question of questions) {
            let giftParam;

            try {
                switch (question.type) {
                    case 'True':
                    case 'False':
                        giftParam = encodeURIComponent(`::${question.type}Statement sobre ${question.topic}::'${question.text}'{${question.correct}}`);
                        break;
                    case 'multipleChoice': 
                        const answersArray = question.answers.split(", ");
                        let formattedAnswers = "";
                        for (const answer of answersArray) {
                            if (answer === question.correctAnswer) {
                                formattedAnswers += `=${answer}`;
                            } else {
                                formattedAnswers += `~${answer}`;
                            }
                        }
                        giftParam = encodeURIComponent(`::Pregunta sobre ${question.question}::{${formattedAnswers}}`);
                        break;
                    
                    case 'openAnswer':
                        giftParam = encodeURIComponent(`::${question.question}::${question.question}{=${question.answer}}`);
                        break;
                    default:
                        console.warn("Tipo de pregunta no reconocido:", question.type);
                        continue;
                }

                const URL = `${baseURL}?wstoken=${token}&wsfunction=${functionName}&moodlewsrestformat=${format}&params=2--1--gift--${giftParam}`;
                
                const response = await fetch(URL, { 
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                let responseData;
                responseData = await response;
                moodleResponses.push({
                    question: question.text || question.question,
                    response: responseData
                });

            } catch (error) {
                console.error("Error procesando la pregunta:", error);
            }
        }

        // return res.status(200).json({
        //     message: "Preguntas procesadas",
        //     responses: moodleResponses
        // });

    } catch (error) {
        console.error('Error procesando las preguntas:', error);
        return res.status(500).json({
            error: 'Error procesando las preguntas',
            details: error.message
        });
    }
};

export default createQuestion;