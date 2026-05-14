import { EventTemplate } from '@/lib/models/template';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { EventTemplateCreateSchema } from '@/lib/schemas';
import { STARTER_TEMPLATES } from '@/lib/templates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'GET') {
      // Re-seed if no public templates exist OR if existing ones are missing new fields
      const outdated = await EventTemplate.countDocuments({
        isPublic: true,
        colorPalette: { $exists: false },
      });
      if (outdated > 0) {
        await EventTemplate.deleteMany({ isPublic: true });
      }
      const existingCount = await EventTemplate.countDocuments({ isPublic: true });
      if (existingCount === 0) {
        await EventTemplate.insertMany(
          STARTER_TEMPLATES.map((template) => ({ ...template, isPublic: true }))
        );
      }

      const session = await getServerSession(req, res, authOptions);
      const userEmail = session?.user?.email;

      let query: any = { isPublic: true };
      if (userEmail) {
        query = { $or: [{ isPublic: true }, { createdBy: userEmail }] };
      }

      const templates = await EventTemplate.find(query);
      sendSuccess(res, templates);
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const body = EventTemplateCreateSchema.parse(req.body);
      const newTemplate = new EventTemplate({
        ...body,
        createdBy: session.user.email,
      });
      const saved = await newTemplate.save();
      sendSuccess(res, saved);
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
        message: 'Failed to process templates request',
      });
    }
  }
}
