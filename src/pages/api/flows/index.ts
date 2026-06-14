import { FlowModel } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { enforceRateLimit, flowsRateLimit } from '@/lib/rate-limit';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Throttle autosave writes (the debounced client stays well under this).
    if (req.method === 'POST' && !(await enforceRateLimit(req, res, flowsRateLimit)))
      return;

    await connectToDB();

    if (req.method === 'GET') {
      const flow = await FlowModel.findOne({ userId });
      sendSuccess(
        res,
        flow ? { nodes: flow.nodes, edges: flow.edges } : { nodes: [], edges: [] }
      );
    } else if (req.method === 'POST') {
      const { nodes, edges } = req.body;
      const updatedFlow = await FlowModel.findOneAndUpdate(
        { userId },
        { nodes, edges, updatedAt: new Date() },
        { upsert: true, returnDocument: 'after' }
      );
      sendSuccess(res, { nodes: updatedFlow.nodes, edges: updatedFlow.edges });
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
        message: 'Failed to process flow request',
      });
    }
  }
}
export default withApiLogging(handler);
