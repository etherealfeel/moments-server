import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        console.log(postMessages);
        res.status(200).json(postMessages);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFilteredPosts = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({
            $or: [{ title }, { tags: { $in: tags.split(',') } }],
        });
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
