import { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';

type SignInData = {
  email: string;
  password: string;
};

export default async function signInHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password }: SignInData = req.body;

    try {
      const { data } = await Axios.post<{ email: string; password: string }>(
        'https://descriptive-bubble-production.up.railway.app/auth/signin',
        { email, password }
      );
      const userInfo: any = data;
      console.log('setting userInfo' + userInfo)
      res.status(200).json({ message: 'Sign-in successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Sign-in failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
