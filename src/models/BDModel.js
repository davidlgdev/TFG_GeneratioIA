import pool from '../db.js';


const saveQuestionsToDB = (questions) => {
    const query = '';

}
const fetchMoodleCourses = async () => {
    try {
        const conn = await pool.getConnection(); 
        const result = await conn.query('SELECT fullname FROM mdl_course');
        conn.release()
        return result;
    } catch (error) {
        console.error("Error fetching courses from the database:", error);
        throw error; 
    }
};

export default { saveQuestionsToDB, fetchMoodleCourses };