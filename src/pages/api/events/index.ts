import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface Event {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const eventData: Event = req.body;
    const db: any = await connectToDB();
    const result: any = await db.collection('events').insertOne(eventData);
    console.log(result);
    res.status(201).json(result!.ops[0]);
  } else if (req.method === 'GET') {
    const db: any = await connectToDB();
    const events = await db.collection('events').find().toArray();
    res.json(events);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
// if (req.method === 'DELETE') {
//   const eventId = req.query.id;
//   const db = await connectToDB();
//   const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });
//   res.status(200).json({ message: 'Event deleted' });
// }
