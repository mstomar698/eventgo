import { EventModel } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

interface Event {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDB();

    if (req.method === 'POST') {
      const eventData: Event = req.body;
      if (!eventData?.title || !eventData?.start || !eventData?.end) {
        return res.status(400).json({ message: 'title, start and end are required' });
      }

      const created = await EventModel.create({
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        color: eventData.color,
      });
      return res.status(201).json(created);
    }

    if (req.method === 'GET') {
      const events = await EventModel.find().sort({ start: 1 });
      return res.status(200).json(events);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Failed to process events request',
    });
  }
}
// if (req.method === 'DELETE') {
//   const eventId = req.query.id;
//   const db = await connectToDB();
//   const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });
//   res.status(200).json({ message: 'Event deleted' });
// }
