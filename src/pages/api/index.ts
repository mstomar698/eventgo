import { sendSuccess } from '@/lib/api-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiLogging } from '@/lib/with-logging';

function apiIndex(req: NextApiRequest, res: NextApiResponse) {
  sendSuccess(res, { message: 'API is running' });
}

export default withApiLogging(apiIndex);
