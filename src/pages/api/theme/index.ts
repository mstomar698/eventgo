import { Theme } from '@/lib/models';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { searchTerm } = req.body;
    console.log(`Search term received at /api/theme: ${searchTerm}`);
    // Check searchterm in db
    try {
      console.log(`connecting to db`);
      res.status(200).json({ message: 'Search term Forwarded' });
      const themes = await Theme.find({ title: searchTerm });
      console.log(themes);
      res.status(200).json({ themes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
}
