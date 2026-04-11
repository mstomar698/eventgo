import { EventTemplate } from '@/lib/models/template';
import { connectToDB } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { STARTER_TEMPLATES } from '@/lib/templates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  try {
    await connectToDB();

    const inserted = [];
    for (const templateData of STARTER_TEMPLATES) {
      const existing = await EventTemplate.findOne({ name: templateData.name });
      if (!existing) {
        const template = new EventTemplate(templateData);
        const saved = await template.save();
        inserted.push(saved);
      }
    }

    sendSuccess(res, { message: `Seeded ${inserted.length} templates`, inserted });
  } catch (error) {
    console.error('Seed templates error:', error);
    sendError(res, 500, {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to seed templates',
    });
  }
}
