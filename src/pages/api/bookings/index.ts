import { Booking } from '@/lib/models/booking';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { BookingCreateSchema } from '@/lib/schemas';
import logger from '@/lib/logger';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !enforceRateLimit(req, res, generalRateLimit)) return;
  try {
    logger.info({ method: req.method }, '[api/bookings] handler invoked');
    const session = await getServerSession(req, res, authOptions);
    logger.info(
      { hasSession: Boolean(session && session.user?.email) },
      '[api/bookings] session present'
    );
    if (!session || !session.user?.email) {
      // Return a friendly 200 with usage info for unauthenticated requests.
      // This keeps non-auth checks non-breaking for read-only probes while
      // preserving the authenticated behavior for real clients.
      sendSuccess(res, {
        info: 'This endpoint requires an authenticated session to access bookings. Authenticate with NextAuth (Google) and retry. Example: GET /api/bookings (authenticated).',
      });
      return;
    }
    const userId = session.user.email;

    await connectToDB();

    if (req.method === 'GET') {
      const bookings = await Booking.find({ createdBy: userId });
      sendSuccess(res, bookings);
    } else if (req.method === 'POST') {
      const body = BookingCreateSchema.parse(req.body);
      const newBooking = new Booking({
        ...body,
        createdBy: userId,
      });
      const saved = await newBooking.save();
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
        message: 'Failed to process bookings request',
      });
    }
  }
}
export default withApiLogging(handler);
