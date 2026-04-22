import { sendSuccess } from '@/lib/api-utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default function apiIndex(req: NextApiRequest, res: NextApiResponse) {
  sendSuccess(res, { message: 'API is running' });
}
