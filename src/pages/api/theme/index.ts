import { Theme } from '@/lib/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { ThemeSearchSchema } from '@/lib/schemas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { searchTerm } = ThemeSearchSchema.parse(req.body);
      const themes = await Theme.find({ title: searchTerm });
      sendSuccess(res, { themes });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        sendError(res, 400, {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error.message,
        });
      } else {
        sendError(res, 500, {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Server error',
        });
      }
    }
  } else {
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
  }
}
