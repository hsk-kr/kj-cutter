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
      resolve(pixelData);
    };

    newImg.onerror = (e) => {
      reject(e);
    };

    newImg.src = imgSrc;
  });
};

export const getBase64DataFromImageData = (data) => {
  return data.substring(data.indexOf(',') + 1);
};

export const getImgDataFromPos = (imgSrc, imgPosList) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const imgDataList = [];

      imgPosList.forEach((imgPos) => {
        const { x1, x2, y1, y2 } = imgPos;

        const cropWidth = x2 - x1 + 1;
        const cropHeight = y2 - y1 + 1;

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        ctx.drawImage(
          img,
          x1,
          y1,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        imgDataList.push(canvas.toDataURL('image/png'));
      });

      resolve(imgDataList);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = imgSrc;
  });
};

/**
 * 이미지들을 찾아 좌표값을 반홥합니다.
 * @param {string} imgSrc
 * @param {number} srtX
 * @param {number} srtY
 * @param {Array} ignoreColor [r, g, b]
 * @param {number} rgbDeviation
 */
export const findImagesPosInImage = (imgSrc, ignoreColor, rgbDeviation) => {
  const _equalPixelColorBetweenTwoPoints = (ctx, x, y, color, rgbDeviation) => {
    const [cr, cg, cb] = ctx.getImageData(x, y, 1, 1).data;
    const [sr, sg, sb] = color;
    if (
      cr >= sr - rgbDeviation &&
      cr <= sr + rgbDeviation &&
      cg >= sg - rgbDeviation &&
      cg <= sg + rgbDeviation &&
      cb >= sb - rgbDeviation &&
      cb <= sb + rgbDeviation
    ) {
      return true;
    } else {
      return false;
    }
  };

  const _findImagePos = (
    ctx,
    srtX,
    srtY,
    ignoreColor,
    rgbDeviation,
    imageWidth,
    imageHeight
  ) => {
    let rectX1 = 0,
      rectY1 = null,
      rectX2 = imageWidth - 1,
      rectY2 = null;
    let found = false;
    let equalsLine = false;

    for (let y = srtY; y < imageHeight; y += 1) {
      equalsLine = true;

      for (let x = srtX; x < imageWidth; x += 1) {
        if (
          !_equalPixelColorBetweenTwoPoints(
            ctx,
            x,
            y,
            ignoreColor,
            rgbDeviation
          )
        ) {
          if (rectY1 === null) {
            rectY1 = y;
          }
          equalsLine = false;
          break;
        }
      }

      if (equalsLine) {
        if (rectY1 !== null) {
          rectY2 = y - 1;
          found = true;
          break;
        }
      }
    }

    if (found) {
      return {
        x1: rectX1,
        y1: rectY1,
        x2: rectX2,
        y2: rectY2,
      };
    }

    return null;
  };

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const newImg = new Image();

    newImg.onload = () => {
      canvas.width = newImg.width;
      canvas.height = newImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(newImg, 0, 0);

      const imagesPosList = [];
      let hasDone = false;
      let srtX = 0,
        srtY = 0;

      while (!hasDone) {
        const pos = _findImagePos(
          ctx,
          srtX,
          srtY,
          ignoreColor,
          rgbDeviation,
          newImg.width,
          newImg.height
        );

        if (!pos) {
          hasDone = true;
          continue;
        }

        srtY = pos.y2 + 1;
        imagesPosList.push(pos);
      }

      return resolve(imagesPosList);
    };

    newImg.onerror = (e) => {
      reject(e);
    };

    newImg.src = imgSrc;
  });
};
