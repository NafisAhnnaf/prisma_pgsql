import express from 'express';
import "dotenv/config";
import cors from 'cors'
import routes from './routes/index.ts'

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use('/api', routes);

app.listen(PORT, () => {
    console.log("Listening on localhost:" + PORT);
});