import { Theme } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { searchTerm } = req.body;
    console.log(`Search term received at /api/searchedtheme: ${searchTerm}`);
    res.status(200).json({ message: 'Search term received' });
    //Check searchterm in db
    try {
      console.log(`connecting to db`);
      await connectToDB();

      const themes = await Theme.find({
        name: { $regex: new RegExp(searchTerm, 'i') },
      }).exec();

      console.log(`Themes matching "${searchTerm}":`, themes);
      res.status(200).json({ message: 'Search term received' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // forward search term to theme page
      //NOTE: MAke Sure to change this back to hosted link when deploying
      const response = await fetch('http://localhost:3000/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });
      const data = await response.json();
      console.log(data);
      res.status(200).json({ message: 'Search term Forwarded' });
    }
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
}
