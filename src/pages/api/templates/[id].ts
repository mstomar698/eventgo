import { EventTemplate } from '@/lib/models/template';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { EventTemplateCreateSchema } from '@/lib/schemas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !enforceRateLimit(req, res, generalRateLimit)) return;
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

    if (req.method === 'GET') {
      const template = await EventTemplate.findById(id);
      if (!template) {
        sendError(res, 404, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Template not found',
        });
        return;
      }
      // Public templates are readable by anyone; private ones only by their owner.
      if (!template.isPublic) {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user?.email || template.createdBy !== session.user.email) {
          // 404 (not 403) so we don't reveal that a private template exists.
          sendError(res, 404, {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Template not found',
          });
          return;
        }
      }
      sendSuccess(res, template);
    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
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

      if (template.createdBy !== session.user.email) {
        sendError(res, 403, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'You can only edit your own templates',
        });
        return;
      }

      const body = EventTemplateCreateSchema.partial().parse(req.body);
      const updated = await EventTemplate.findByIdAndUpdate(id, body, { new: true });
      sendSuccess(res, updated);
    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
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

      if (template.createdBy !== session.user.email) {
        sendError(res, 403, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'You can only delete your own templates',
        });
        return;
      }

      const deleted = await EventTemplate.findByIdAndDelete(id);
      sendSuccess(res, deleted);
    } else {
      sendError(res, 405, {
        code: ERROR_CODES.METHOD_NOT_ALLOWED,
        message: 'Method not allowed',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 400, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: error.message,
      });
    } else {
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to process template request',
      });
    }
  }
}
