export const getPixcelColorFromImage = (imgSrc, width, height, x, y) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const newImg = new Image();

    newImg.onload = () => {
      const { width: imgW, height: imgH } = newImg;
      ctx.drawImage(newImg, 0, 0, imgW, imgH, 0, 0, width, height);
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      console.log(x, ',', y);
      resolve(pixelData);
    };

    newImg.onerror = (e) => {
      reject(e);
    };

    newImg.src = imgSrc;
  });
};
