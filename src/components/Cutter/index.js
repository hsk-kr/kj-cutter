import React, { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './styles.scss';
import {
  getPixcelColorFromImage,
  findImagesPosInImage,
  getImgDataFromPos,
  getBase64DataFromImageData,
} from 'lib/canvas';

import sampleImg from 'resources/images/sample2.jpg';

const getRgbColor = (r, g, b) => {
  return `rgb(${r}, ${g}, ${b})`;
};

const Cutter = ({ className }) => {
  const targetImgRef = useRef();
  const [targetPos, setTargetPos] = useState({ x: -1, y: -1 });
  const [targetColor, setTargetColor] = useState([0, 0, 0]);
  const [working, setWorking] = useState(false);
  const [posList, setPosList] = useState([]);

  const handleMouseDown = useCallback((e) => {
    const { clientX, clientY } = e;
    const {
      x,
      y,
      width,
      height,
    } = targetImgRef.current.getBoundingClientRect();
    const mouseX = clientX - x;
    const mouseY = clientY - y;

    getPixcelColorFromImage(sampleImg, width, height, mouseX, mouseY).then(
      (data) => {
        setTargetPos({ x: mouseX, y: mouseY });
        setTargetColor([data[0], data[1], data[2]]);
      }
    );
  }, []);

  const handleCropStart = useCallback(
    (e) => {
      setWorking(true);
      findImagesPosInImage(sampleImg, targetColor, 5)
        .then((posList) => {
          getImgDataFromPos(sampleImg, posList)
            .then((data) => {
              // temp
              var zip = new JSZip();

              for (let i = 0; i < data.length; i++) {
                zip.file(i + '.jpg', getBase64DataFromImageData(data[i]), {
                  base64: true,
                });
              }

              zip
                .generateAsync({ type: 'blob' })
                .then(function (content) {
                  saveAs(content, 'example.zip');
                })
                .finally(() => {
                  setWorking(false);
                });
              // console.log(data);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [targetColor]
  );

  return (
    <div className={`_cutter ${className} ? ${className} : ''`}>
      <img
        src={sampleImg}
        alt="cutting target"
        ref={targetImgRef}
        className="cutting-image"
        onMouseDown={handleMouseDown}
      />
      <div className="palette">
        <div
          className="target-color"
          style={{ backgroundColor: getRgbColor(...targetColor) }}
        />
        <div className="palette-rgb">
          <div>
            <label>R:</label>
            <label>{targetColor[0]}</label>
          </div>
          <div>
            <label>G:</label>
            <label>{targetColor[1]}</label>
          </div>
          <div>
            <label>B:</label>
            <label>{targetColor[2]}</label>
          </div>
          <div>
            <label>X:</label>
            <label>{targetPos.x}</label>
          </div>
          <div>
            <label>Y:</label>
            <label>{targetPos.y}</label>
          </div>
        </div>
        <button type="button" disabled={working} onClick={handleCropStart}>
          START
        </button>
      </div>
    </div>
  );
};

export default Cutter;
