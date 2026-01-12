import express from 'express';
import "dotenv/config";
import cors from 'cors'
import UserRoutes from './routes/user.routes.ts'
import PostRoutes from './routes/post.routes.ts'

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', UserRoutes)
app.use('/api/posts', PostRoutes)

app.listen(PORT, () => {
    console.log("Listening on localhost:" + PORT);
});