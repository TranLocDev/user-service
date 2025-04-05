const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadImage(file) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const key = `uploads/${uuidv4()}.${fileExtension}`;
      
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      return {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key
      };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteImage(fileUrl) {
    try {
      const urlParts = new URL(fileUrl);
      const key = decodeURIComponent(urlParts.pathname.slice(1));

      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
      };

      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);

      return true;
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}

module.exports = new S3Service();