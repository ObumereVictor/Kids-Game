const cloudinary = require("cloudinary");

const cloudinaryConfig = cloudinary.config({
  api_key: "858253899162874",
  api_secret: "3AuAD3U-5ygWT-NaE6Qxzt0eowI",
  secure: true,
  cloud_name: "dcuy6upus",
});

module.exports = { cloudinaryConfig };
