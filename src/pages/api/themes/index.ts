// import { Theme } from '@/lib/models';
// import { connectToDB } from '@/lib/mongodb';
// import Validate from 'next-api-validation';

// connectToDB();

// const themesHandler = Validate({
//   async post(req, res) {
//     try {
//       const body = req.body;
//       const newTheme = new Theme(body);
//       const saved = await newTheme.save();
//       res.send(saved);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send('error');
//     }
//   },
// });

// export default themesHandler;
import { ITheme, Theme } from '@/lib/models';
import { connectToDB } from '@/lib/mongodb';
import Validate from 'next-api-validation';
import type { NextApiHandler } from 'next';

const themesHandler = Validate({
  async get(req, res) {
    try {
      await connectToDB();
      const themes = await Theme.find();
      res.json(themes);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to fetch themes',
      });
    }
  },
  async post(req, res) {
    try {
      await connectToDB();
      const body: ITheme = req.body;
      const newTheme = new Theme(body);
      const saved = await newTheme.save();
      res.send(saved);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to create theme',
      });
    }
  },
  async delete(req, res) {
    const { id } = req.query;
    try {
      await connectToDB();
      const deletedTheme = await Theme.findByIdAndDelete(id);
      res.send(deletedTheme);
    } catch {
      res.status(500).send({
        error: 'Failed to remove Theme',
      });
    }
  },
});

export default themesHandler as unknown as NextApiHandler;
