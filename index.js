import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import users from './routes/users.js'; 
import notes from './routes/notes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send("API is working");
});

app.use('/users', users);
app.use('/notes', notes);

app.listen(port, () => {
    console.log(`API is listening on port number ${port}`);
});

export default app;