// import { Theme } from '@/lib/models';
// import { connectToDB } from '@/lib/mongodb';
// import Validate from 'next-api-validation';

// connectToDB();

// const themesHandler = Validate({
//   async post(req, res) {
//     try {
//       const body = req.body;
//       const newTheme = new Theme(body);
//       const saved = await newTheme.save();
//       res.send(saved);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send('error');
//     }
//   },
// });

// export default themesHandler;
import { Theme } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { ThemeCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'GET') {
      const themes = await Theme.find();
      sendSuccess(res, themes);
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const body = ThemeCreateSchema.parse(req.body);
      const newTheme = new Theme(body);
      const saved = await newTheme.save();
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
      const deletedTheme = await Theme.findByIdAndDelete(id);
      if (!deletedTheme) {
        sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Theme not found' });
      } else {
        sendSuccess(res, deletedTheme);
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
