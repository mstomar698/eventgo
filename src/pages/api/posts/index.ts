import { IPost, Post } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import Validate from 'next-api-validation';

connectToDB();

const postsHandler = Validate({
  async get(req, res) {
    try {
      const posts = await Post.find();
      res.json(posts.reverse());
    } catch (err) {
      console.log(err);
      res.status(500).send('error');
    }
  },
  async post(req, res) {
    try {
      const body: IPost = req.body;
      const newPost = new Post(body);
      const saved = await newPost.save();
      res.send(saved);
    } catch (err) {
      console.log(err);
      res.status(500).send('error');
    }
  },
  async delete(req, res) {
    const { id } = req.query;
    try {
      const deletedPost = await Post.findByIdAndDelete(id);
      res.send(deletedPost);
    } catch (err) {
      res.status(500).send({
        error: 'Failed to remove post',
      });
    }
  },
});

export default postsHandler;
