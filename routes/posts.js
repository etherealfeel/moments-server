import express from 'express';
import {
    getPost,
    getPosts,
    getFilteredPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
} from '../controllers/posts.js';

const router = express.Router();

router.get('/search', getFilteredPosts);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);

export default router;
