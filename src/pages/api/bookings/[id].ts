import { Booking } from '@/lib/models/booking';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { BookingUpdateSchema } from '@/lib/schemas';
import logger from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !enforceRateLimit(req, res, generalRateLimit)) return;
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      sendError(res, 401, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required',
      });
      return;
    }
    const userId = session.user.email;

    const { id } = req.query;
    if (typeof id !== 'string' || id.trim().length === 0) {
      sendError(res, 400, {
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid booking id',
      });
      return;
    }

    await connectToDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      sendError(res, 404, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Booking not found',
      });
      return;
    }

    if (booking.createdBy !== userId) {
      sendError(res, 403, {
        code: ERROR_CODES.FORBIDDEN,
        message: 'You can only modify your own bookings',
      });
      return;
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = BookingUpdateSchema.parse(req.body);
      const updated = await Booking.findByIdAndUpdate(id, body, { new: true });
      logger.info({ id }, '[api/bookings/:id] updated');
      sendSuccess(res, updated);
    } else if (req.method === 'DELETE') {
      const deleted = await Booking.findByIdAndDelete(id);
      logger.info({ id }, '[api/bookings/:id] deleted');
      sendSuccess(res, deleted);
    } else {
      res.setHeader('Allow', 'PATCH, DELETE');
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
        message: 'Failed to process booking request',
      });
    }
  }
}
