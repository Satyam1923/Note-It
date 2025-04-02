import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import detectPort from 'detect-port';
import auth from './routes/auth.js';
import notes from './routes/notes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DEFAULT_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send("API is working");
});

app.use('/auth', auth);
app.use('/notes', notes);

detectPort(DEFAULT_PORT).then((availablePort) => {
    app.listen(availablePort, () => {
        console.log(`API is listening on port number ${availablePort}`);
    });
}).catch((err) => {
    console.error("Error detecting port:", err);
});
