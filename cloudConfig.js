// Cloudinary : It is a cloud-based service used to store, manage, optimize, and deliver images and videos.
// We store image on cloudinary and cloudinary gives url which we store in our mongo database.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'homestay',  // floder in cloudinary
    allowed_formats: ['png', 'jpg', 'jpeg'],
  },
});

module.exports = {
    cloudinary,
    storage
}