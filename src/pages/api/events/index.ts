import { EventModel } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { EventCreateSchema } from '@/lib/schemas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const eventData = EventCreateSchema.parse(req.body);
      const created = await EventModel.create({
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        color: eventData.color,
      });
      sendSuccess(res, created);
    } else if (req.method === 'GET') {
      const events = await EventModel.find().sort({ start: 1 });
      sendSuccess(res, events);
    } else if (req.method === 'DELETE') {
      const eventId = req.query.id;
      if (typeof eventId !== 'string' || !mongoose.Types.ObjectId.isValid(eventId)) {
        sendError(res, 400, {
          code: ERROR_CODES.BAD_REQUEST,
          message: 'Invalid event id',
        });
        return;
      }

      const deleted = await EventModel.findByIdAndDelete(eventId);
      if (!deleted) {
        sendError(res, 404, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Event not found',
        });
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
// if (req.method === 'DELETE') {
//   const eventId = req.query.id;
//   const db = await connectToDB();
//   const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });
//   res.status(200).json({ message: 'Event deleted' });
// }
