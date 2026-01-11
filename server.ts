import express from 'express';
import "dotenv/config";
import cors from 'cors'
import prisma from './utils/prisma.ts'
import { generateHashedPassword } from './utils/hash.ts';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const user = await prisma.user.findUnique({
                where: { id: id }
            });
            if (user) {
                res.status(200).json({ payload: { user: user } });
            }
            else {
                throw Error("No user found")
            }
        }
        else {
            throw Error("id not found in request");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
});

app.post('/api/users', async (req, res) => {
    const { id, first_name, last_name, email, password } = req.body;
    const hashedPassword = await generateHashedPassword(password);
    console.log(id);
    const user = {
        id: id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword
    }
    try {
        if (user) {
            const response = await prisma.user.create({
                data: user
            })
            res.status(201).json({ message: "User created successfully" });
        }
        else {
            throw Error("User not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error })
    }
})

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                image_urls: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                    },
                },
            },
        });
        if (posts) {
            res.status(200).json({ payload: { posts: posts } });
        }
        else {
            throw Error("No posts found")
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json(error.message)
    }
});

app.post('/api/posts', async (req, res) => {
    const { title, content, image_urls, userID } = req.body;
    const post = {
        title, content, image_urls, userID
    }
    try {
        if (post) {
            const response = await prisma.post.create({
                data: post
            })
            res.status(201).json({ message: "Post created successfully" });
        }
        else {
            throw Error("Post not valid");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "An Error occured, " + error.message })
    }
})

app.listen(PORT, () => {
    console.log("Listening on localhost:" + PORT);
});