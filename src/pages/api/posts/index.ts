import { Post } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { PostCreateSchema } from '@/lib/schemas';
import { z } from 'zod';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !(await enforceRateLimit(req, res, generalRateLimit)))
    return;
  try {
    await connectToDB();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      sendError(res, 401, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required',
      });
      return;
    }
    const email = session.user.email;

    if (req.method === 'GET') {
      const posts = await Post.find({ createdBy: email }).sort({ createdAt: -1 });
      sendSuccess(res, posts);
    } else if (req.method === 'POST') {
      const body = PostCreateSchema.parse(req.body);
      const saved = await new Post({ ...body, createdBy: email }).save();
      sendSuccess(res, saved);
    } else if (req.method === 'PATCH') {
      const { id, ...updateData } = req.body;
      if (!id) {
        sendError(res, 400, {
          code: ERROR_CODES.BAD_REQUEST,
          message: 'Post ID is required',
        });
        return;
      }
      const body = PostCreateSchema.partial().parse(updateData);
      const updated = await Post.findOneAndUpdate({ _id: id, createdBy: email }, body, {
        new: true,
      });
      if (!updated) {
        sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Post not found' });
        return;
      }
      sendSuccess(res, updated);
    } else if (req.method === 'DELETE') {
      const { id } = z.object({ id: z.string().min(1) }).parse(req.query);
      const deleted = await Post.findOneAndDelete({ _id: id, createdBy: email });
      if (!deleted) {
        sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Post not found' });
      } else {
        sendSuccess(res, deleted);
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
export default withApiLogging(handler);
