import { Vendor } from '@/lib/models/vendor';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, generalRateLimit } from '@/lib/rate-limit';
import { VendorCreateSchema } from '@/lib/schemas';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !enforceRateLimit(req, res, generalRateLimit)) return;
  try {
    await connectToDB();

    if (req.method === 'GET') {
      const vendors = await Vendor.find({ isPublic: true });
      sendSuccess(res, vendors);
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user?.email) {
        sendError(res, 401, {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }
      const body = VendorCreateSchema.parse(req.body);
      const newVendor = new Vendor({
        ...body,
        createdBy: session.user.email,
      });
      const saved = await newVendor.save();
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
        message: 'Failed to process vendors request',
      });
    }
  }
}
export default withApiLogging(handler);
