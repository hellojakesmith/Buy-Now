import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

const DEFAULT_BUCKET_NAME = "media";

function getDb() {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection is not ready");
  }

  return mongoose.connection.db;
}

export function getMediaBucket(bucketName = DEFAULT_BUCKET_NAME) {
  return new GridFSBucket(getDb(), { bucketName });
}

export async function uploadBufferToGridFs(options: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  metadata?: Record<string, unknown>;
  bucketName?: string;
}) {
  const bucket = getMediaBucket(options.bucketName);
  const uploadStream = bucket.openUploadStream(options.filename, {
    contentType: options.contentType,
    metadata: options.metadata,
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(options.buffer);
  });

  return uploadStream.id as ObjectId;
}

export function openDownloadStream(fileId: string | ObjectId, bucketName = DEFAULT_BUCKET_NAME) {
  return getMediaBucket(bucketName).openDownloadStream(new ObjectId(fileId));
}

export async function deleteFromGridFs(fileId: string | ObjectId, bucketName = DEFAULT_BUCKET_NAME) {
  await getMediaBucket(bucketName).delete(new ObjectId(fileId));
}
