import { connectToDB } from '@/lib/mongodb';
import { EventTemplate } from '@/lib/models/template';
import { Theme } from '@/lib/models/theme';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';

// Deletes all user-owned data. action=data → data only; action=account → data + session invalidation signal
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !enforceRateLimit(req, res, generalRateLimit)) return;
  if (req.method !== 'DELETE') {
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    sendError(res, 401, {
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Authentication required',
    });
    return;
  }

  try {
    await connectToDB();
    const email = session.user.email;

    // Delete user-scoped content
    const [templates, themes] = await Promise.all([
      EventTemplate.deleteMany({ createdBy: email }),
      Theme.deleteMany({ isPublic: false, createdBy: email }),
    ]);

    // Also attempt themes without createdBy (legacy user themes)
    await Theme.deleteMany({ isPublic: false });

    sendSuccess(
      res,
      {
        deleted: {
          templates: templates.deletedCount,
          themes: themes.deletedCount,
        },
      },
      'Data deleted successfully'
    );
  } catch (error) {
    sendError(res, 500, {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete data',
    });
  }
}
