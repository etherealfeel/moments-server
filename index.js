import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config.js';
import postRoutes from './routes/posts.js';

const app = express();

app.use('/posts', postRoutes);

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const connectionURL = process.env.CONNECTION_URL;
const port = process.env.PORT || 4000;

mongoose
    .connect(connectionURL)
    .then(() =>
        app.listen(port, () => console.log(`Server running on port: ${port}`))
    )
    .catch((error) => console.log(error.message));
