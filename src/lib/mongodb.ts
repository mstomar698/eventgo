import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;

const getMaskedHost = (mongoUri: string): string => {
  try {
    const afterProtocol = mongoUri.split('://')[1] || mongoUri;
    const hostPart = afterProtocol.includes('@') ? afterProtocol.split('@')[1] : afterProtocol;
    const host = hostPart.split('/')[0];
    return host;
  } catch {
    return 'unknown-host';
  }
};

export const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.info(`[db] Already connected to MongoDB (${getMaskedHost(uri)})`);
    return mongoose.connection;
  }

  try {
    console.info(`[db] MONGODB_URI detected. Attempting connection to MongoDB host: ${getMaskedHost(uri)} (credentials hidden)`);
    await mongoose.connect(uri);
    console.info(`[db] MongoDB connected to host: ${getMaskedHost(uri)}`);
    return mongoose.connection;
  } catch (error) {
    console.error('[db] MongoDB connection error:', error instanceof Error ? error.message : error);
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
