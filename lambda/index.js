const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const sharp = require('sharp');
// import sharp from 'sharp';

// creates a new S3 client
const s3 = new S3Client({ region: 'us-east-1' });

exports.handler = async (event) => {
  // extract bucket and object key from the event
  const region = event.Records[0].awsRegion;
  const bucketName = event.Records[0].s3.bucket.name;
  const originalKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );

  // ensure the key matches the prefix for original images
  if (!originalKey.startsWith('original-images/')) {
    console.log('Ignoring non-original image upload.');
    return;
  }

  // set the thumbnail key and prefix for resized images
  const thumbnailKey = originalKey.replace(
    'original-images/',
    'resized-images/'
  );

  try {
    // get the original image from the bucket
    const getObjectParams = { Bucket: bucketName, Key: originalKey };
    const originalImage = await s3.send(new GetObjectCommand(getObjectParams));
    const imageBuffer = await streamToBuffer(originalImage.Body);

    // resize the image using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 200 })
      .toBuffer();

    // upload the resized image back to the S3 bucket with the new key
    const putObjectParams = {
      Bucket: bucketName,
      Key: thumbnailKey,
      Body: resizedImageBuffer,
      ContentType: originalImage.ContentType,
    };
    await s3.send(new PutObjectCommand(putObjectParams));

    console.log(`Successfully created thumbnail at ${thumbnailKey}`);
  } catch (error) {
    console.error('Error processing S3 event:', error);
  }
};

// helper function to convert a stream to a buffer
const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
