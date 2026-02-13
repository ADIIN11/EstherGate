const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


exports.uploadProfileImage= async function(filePath, userId) { 
    return cloudinary.uploader.upload(filePath, { 
        folder: 'esther_gate/profile_images', 
        public_id: `user_${userId}_profileImg`, 
        overwrite: true 
    });
 } 

exports.deleteImage=async function(publicId) { 
    return cloudinary.uploader.destroy(publicId); 
}


exports.uploadProductImage= async function(filePath,productId, imageNumber) { 
    return cloudinary.uploader.upload(filePath, { 
        folder: `esther_gate/product_images/product_${productId}`, 
        public_id: `product_${productId}_image_${imageNumber}`, 
        overwrite: true 
    });
 } 