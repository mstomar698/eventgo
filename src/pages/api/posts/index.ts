import { IPost, Post } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import Validate from 'next-api-validation';
import type { NextApiHandler } from 'next';

const postsHandler = Validate({
  async get(req, res) {
    try {
      await connectToDB();
      const posts = await Post.find();
      res.json(posts.reverse());
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
      });
    }
  },
  async post(req, res) {
    try {
      await connectToDB();
      const body: IPost = req.body;
      const newPost = new Post(body);
      const saved = await newPost.save();
      res.send(saved);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to create post',
      });
    }
  },
  async delete(req, res) {
    const { id } = req.query;
    try {
      await connectToDB();
      const deletedPost = await Post.findByIdAndDelete(id);
      res.send(deletedPost);
    } catch {
      res.status(500).send({
        error: 'Failed to remove post',
      });
    }
  },
});

export default postsHandler as unknown as NextApiHandler;
