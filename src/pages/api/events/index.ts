import { EventModel } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { EventCreateSchema } from '@/lib/schemas';
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
      const events = await EventModel.find({ createdBy: email }).sort({ start: 1 });
      sendSuccess(res, events);
    } else if (req.method === 'POST') {
      const eventData = EventCreateSchema.parse(req.body);
      const created = await EventModel.create({
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        color: eventData.color,
        createdBy: email,
      });
      sendSuccess(res, created);
    } else if (req.method === 'DELETE') {
      const eventId = req.query.id;
      if (typeof eventId !== 'string' || !mongoose.Types.ObjectId.isValid(eventId)) {
        sendError(res, 400, {
          code: ERROR_CODES.BAD_REQUEST,
          message: 'Invalid event id',
        });
        return;
      }
      const deleted = await EventModel.findOneAndDelete({
        _id: eventId,
        createdBy: email,
      });
      if (!deleted) {
        sendError(res, 404, { code: ERROR_CODES.NOT_FOUND, message: 'Event not found' });
        return;
      }
      sendSuccess(res, { id: eventId }, 'Event deleted');
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
        message: 'Failed to process events request',
      });
    }
  }
}
export default withApiLogging(handler);
