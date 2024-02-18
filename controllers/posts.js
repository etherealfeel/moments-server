import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (err) {
        res.status(404).json();
    }
};

export const getFilteredPosts = async (req, res) => {
    const { searchQuery, tags: queryTags } = req.query;
    try {
        const regex = new RegExp(searchQuery, 'i');

        const posts = await PostMessage.find(queryTags ? { tags: { $in: queryTags } } : { title: regex });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json();
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No such post with corresponding id ');
    const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        { ...post, _id },
        {
            new: true,
        }
    );
    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No such post with corresponding id ');

    await PostMessage.findByIdAndDelete(_id);
    res.json({ message: 'Post has been successfuly deleted.' });
};

export const likePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No such post with corresponding id ');
    const post = await PostMessage.findById(_id);
    const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        {
            likeCount: post.likeCount + 1,
        },
        { new: true }
    );

    res.json(updatedPost);
};
