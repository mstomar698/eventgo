import { Theme } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { ThemeSearchSchema } from '@/lib/schemas';
import logger from '@/lib/logger';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDB();
      const { searchTerm } = ThemeSearchSchema.parse(req.body);
      // Only public themes are searchable — never expose other users' private themes.
      const themes = await Theme.find({ title: searchTerm, isPublic: true });
      sendSuccess(res, { themes });
    } catch (error) {
      logger.error({ err: error }, 'theme handler error');
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
export default withApiLogging(handler);
