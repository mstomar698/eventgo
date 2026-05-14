import { Theme } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { ThemeCreateSchema } from '@/lib/schemas';
import { STARTER_THEMES } from '@/lib/starter-themes';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'GET') {
      const { id } = req.query;

      // Single theme fetch (no auth required — used by view/edit pages)
      if (typeof id === 'string' && id) {
        const theme = await Theme.findById(id);
        if (!theme) {
          sendError(res, 404, {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Theme not found',
          });
          return;
        }
        sendSuccess(res, theme);
        return;
      }

      // Seed starter themes once
      const publicCount = await Theme.countDocuments({ isPublic: true });
      if (publicCount === 0) {
        await Theme.insertMany(
          STARTER_THEMES.map((t) => ({ ...t, isPublic: true, date: new Date() }))
        );
      }

      // Return public (starter) themes + this user's private themes
      const session = await getServerSession(req, res, authOptions);
      const email = session?.user?.email;
      const query = email
        ? { $or: [{ isPublic: true }, { createdBy: email }] }
        : { isPublic: true };

      const themes = await Theme.find(query).sort({ createdAt: -1 });
      sendSuccess(res, themes);
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const body = ThemeCreateSchema.parse(req.body);
      const saved = await new Theme({ ...body, createdBy: session.user.email }).save();
      sendSuccess(res, saved);
    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const { id } = z.object({ id: z.string().min(1) }).parse(req.query);
      const body = ThemeCreateSchema.partial().parse(req.body);
      // Only allow editing own themes
      const updated = await Theme.findOneAndUpdate(
        { _id: id, createdBy: session.user.email },
        body,
        { new: true }
      );
      if (!updated) {
        sendError(res, 404, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Theme not found or not authorised',
        });
      } else {
        sendSuccess(res, updated);
      }
    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const { id } = z.object({ id: z.string().min(1) }).parse(req.query);
      // Only allow deleting own themes
      const deleted = await Theme.findOneAndDelete({
        _id: id,
        createdBy: session.user.email,
      });
      if (!deleted) {
        sendError(res, 404, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Theme not found or not authorised',
        });
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
        message: 'Failed to process themes request',
      });
    }
  }
}
