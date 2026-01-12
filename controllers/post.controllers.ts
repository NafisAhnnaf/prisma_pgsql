import prisma from '../utils/prisma.ts'


const getAllPosts = async (req, res) => {
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
}

const createPost = async (req, res) => {
    const { title, content, image_urls, user_id } = req.body;
    const post = {
        title, content, image_urls, user_id
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
}


export { createPost, getAllPosts };