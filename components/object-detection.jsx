"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "../utils/render-predictions";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [confidence, setConfidence] = useState(0.6);
  const [theme, setTheme] = useState("dark");
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webCamRef.current?.video?.readyState === 4
    ) {
      const video = webCamRef.current.video;
      const context = canvasRef.current.getContext("2d");

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // Object Detection
      const detectedObjects = await net.detect(video, undefined, confidence);
      renderPredictions(detectedObjects, context);

    //   if (detectedObjects.length > 0) {
    //     playBeep();
    //   }
    }
  }

//   const playBeep = () => {
//     const audio = new Audio("/beep.mp3"); // Add a beep sound file in your public folder
//     audio.play();
//   };

  const takeScreenshot = () => {
    if (webCamRef.current) {
      const imageSrc = webCamRef.current.getScreenshot();
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = "screenshot.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    runCoco();
  }, [confidence]);

  return (
    <div className={`container ${theme}`}>
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading models...</p>
        </div>
      ) : (
        <div className="video-container">
          <div className="webcam-wrapper">
            {/* Webcam */}
            <Webcam ref={webCamRef} className="webcam" muted screenshotFormat="image/png" />
            {/* Canvas */}
            <canvas ref={canvasRef} className="canvas-overlay" />
          </div>

          <div className="controls">
            <button onClick={takeScreenshot} className="btn screenshot-btn">
              📸 Take Screenshot
            </button>
            <div className="slider-container">
  <label>Confidence Threshold: {Number(confidence).toFixed(1)}</label>
  <input
    type="range"
    min="0.1"
    max="1"
    step="0.1"
    value={confidence}
    onChange={(e) => setConfidence(parseFloat(e.target.value))}
    className="slider"
  />
</div>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn theme-btn">
              {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <p className="status-text">Object Detection Active</p>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
