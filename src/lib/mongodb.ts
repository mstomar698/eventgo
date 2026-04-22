import mongoose from 'mongoose';
import logger from './logger';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;

const getMaskedHost = (mongoUri: string): string => {
  try {
    const afterProtocol = mongoUri.split('://')[1] || mongoUri;
    const hostPart = afterProtocol.includes('@')
      ? afterProtocol.split('@')[1]
      : afterProtocol;
    const host = hostPart.split('/')[0];
    return host;
  } catch {
    return 'unknown-host';
  }
};

export const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    logger.info({ host: getMaskedHost(uri) }, '[db] Already connected to MongoDB');
    return mongoose.connection;
  }

  try {
    logger.info(
      { host: getMaskedHost(uri) },
      '[db] MONGODB_URI detected. Attempting connection to MongoDB (credentials hidden)'
    );
    await mongoose.connect(uri);
    logger.info({ host: getMaskedHost(uri) }, '[db] MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    logger.error({ err: error }, '[db] MongoDB connection error');
    if (
      error instanceof Error &&
      error.message.includes('Protocol and host list are required') &&
      uri.includes('@@')
    ) {
      throw new Error(
        `${error.message}. MONGODB_URI appears to contain an unescaped "@" in credentials; URL-encode special characters in username/password (e.g. "@" -> "%40").`
      );
    }

    throw error;
  }
};
