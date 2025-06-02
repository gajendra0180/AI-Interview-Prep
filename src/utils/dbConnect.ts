import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define the type for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global namespace to include mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { [key: string]: any } | undefined;
}

// Initialize the cached variable with a default value
let cached: MongooseCache = (global.mongoose as MongooseCache) || { conn: null, promise: null };

// Store the connection in the global object
if (!global.mongoose) {
  global.mongoose = cached as any;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;