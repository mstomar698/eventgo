import { connect, connection } from 'mongoose';
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;

// const {
//   MONGODB_URI = 'mongodb+srv://201b153:mayankm698@cluster0.wbsyach.mongodb.net/?retryWrites=true&w=majority',
// } = process.env;

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDB = async () => {
  if (!connection.readyState) {
    console.log('Connecting to ', uri);
    connect(uri, options);
  }
};
