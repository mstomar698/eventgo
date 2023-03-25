import { connect, connection } from 'mongoose';
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDB = async () => {
  if (!connection.readyState) {
    console.log('Connecting to ', uri);
    connect(uri, options);
  }
  return connection;
};
