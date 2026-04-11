import { EventTemplate } from '@/lib/models/template';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  try {
    await connectToDB();

    const { id } = req.query;
    if (typeof id !== 'string' || id.trim().length === 0) {
      sendError(res, 400, {
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid template id',
      });
      return;
    }

    const template = await EventTemplate.findById(id);
    if (!template) {
      sendError(res, 404, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Template not found',
      });
      return;
    }

    sendSuccess(res, template);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 400, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: error.message,
      });
    } else {
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to fetch template',
      });
    }
  }
}
