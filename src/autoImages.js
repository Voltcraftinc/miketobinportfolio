// src/autoImages.js

function importAll(r) {
    return r.keys().map((filePath) => r(filePath));
  }
  
  // Must have a real folder "assets" INSIDE src, holding files named image(XX).jpg/png/etc:
  const req = require.context(
    "./assets",
    false,
    /image\(\d+\)\.(png|jpe?g|gif|webp|mp4)$/i
  );
  
  const imagesArray = importAll(req);
  
  export default imagesArray;
  