import { Post } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { PostCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'GET') {
      const posts = await Post.find();
      sendSuccess(res, posts.reverse());
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const body = PostCreateSchema.parse(req.body);
      const newPost = new Post(body);
      const saved = await newPost.save();
      sendSuccess(res, saved);
    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const { id } = z.object({ id: z.string().min(1) }).parse(req.query);
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Post not found' });
      } else {
        sendSuccess(res, deletedPost);
      }
    } else {
      sendError(res, 405, {
        code: ERROR_CODES.METHOD_NOT_ALLOWED,
        message: 'Method not allowed',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 400, { code: ERROR_CODES.VALIDATION_ERROR, message: error.message });
    } else {
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to process posts request',
      });
    }
  }
}
