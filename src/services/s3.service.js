const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: config.aws.region || process.env.AWS_REGION,
  credentials: {
    accessKeyId: config.aws.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class S3Service {
  async uploadImage(file) {
    try {
      if (!file || !file.path) {
        throw new Error('No file provided');
      }

      const bucketName = config.aws.bucketName || process.env.S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error('S3 bucket name is not configured');
      }

      // Read file from disk
      const fileStream = fs.createReadStream(file.path);
      
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: `users/${Date.now()}-${file.originalname}`,
          Body: fileStream,
          ContentType: file.mimetype,
        },
      });

      const result = await upload.done();
      
      // Delete temporary file
      fs.unlinkSync(file.path);
      
      return result;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload image to S3');
    }
  }

  async deleteImage(fileUrl) {
    try {
      const bucketName = config.aws.bucketName || process.env.S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error('S3 bucket name is not configured');
      }

      const urlParts = new URL(fileUrl);
      const key = decodeURIComponent(urlParts.pathname.slice(1));

      const deleteParams = {
        Bucket: bucketName,
        Key: key
      };

      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);

      return true;
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}

module.exports = new S3Service();