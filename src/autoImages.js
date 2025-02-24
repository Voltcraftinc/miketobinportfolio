// src/autoImages.js

function importAll(r) {
    return r.keys().map((filePath) => r(filePath));
}

// Load images from the assets folder
const req = require.context(
    "./assets",
    false,
    /image\(\d+\)\.(png|jpe?g|gif|webp|mp4)$/i
);

const imagesArray = importAll(req);

export default imagesArray;
