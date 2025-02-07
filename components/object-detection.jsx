"use client"

import React, { useEffect, useRef,useState } from 'react'
import Webcam from 'react-webcam';
import{load as cocoSSDLoad} from"@tensorflow-models/coco-ssd";
import *as tf from '@tensorflow/tfjs';
import { renderPredictions } from '../utils/render-predictions';


let detectInterval
const Objectdetection = () => {

    const [isLoading,setIsLoading]=useState(true);
    const webCamref= useRef(null);
    const canvasRef=useRef(null);

    const runCoco = async ()=>{
        setIsLoading(true);
      const net =  await cocoSSDLoad();
      setIsLoading(false);

      detectInterval =  setInterval(()=>{
     runObjectDetection(net)
      },10)
    }

async function runObjectDetection(net) {
    if( canvasRef.current &&
         webCamref.current !==null &&
          webCamref.current.video?.readyState ===4
        ) {
            canvasRef.current.width = webCamref.current.video.videoWidth;
            canvasRef.current.height = webCamref.current.video.videoHeight;

//find detected objects

const detectedObjects = await net.detect(
     webCamref.current.video,
    undefined,
    0.6
);
// console.log(detectedObjects)

const context = canvasRef.current.getContext("2d")
renderPredictions(detectedObjects,context)
    }
    
}


    const showmyVideo = ()=>{
        if(webCamref.current!==null && webCamref.current.video?.readyState ===4){

const myVideoWidth = webCamref.current.video.videoWidth;
const myVideoHeight = webCamref.current.video.videoHeight;


webCamref.current.video.videoWidth= myVideoWidth;
webCamref.current.video.videoHeight = myVideoHeight;
        }
    };
    useEffect(()=>{
        runCoco();
showmyVideo()
    },[])

  return (
    <div className='mt-8'>
        {isLoading ? (
    <div className='gradient-title'> lOadinggg </div>
):(
<div className=' relative flex justify-center items-center gradient p-1.5 rounded-md'>
        {/* webcam */}
        <Webcam
         ref={webCamref} 
         className=" rounded-md w-full lg:h-[720px]"
          muted/>
        {/* canvas */}

     <canvas
      ref={canvasRef}
 className="absolute top-0 left-0  w-full lg:h-[720px]"
/>
    </div>
   ) }
    
  
    </div>
  );
}

export default Objectdetection;