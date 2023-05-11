import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default function signOutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log('signout running')
    deleteCookie('userInfo', {req, res})
    res.status(200).json({ message: 'Cookie-deleted' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
