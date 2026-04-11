import { sendSuccess } from '@/lib/api-utils';

export default function apiIndex(req: any, res: any) {
  sendSuccess(res, { message: 'hi' });
}
