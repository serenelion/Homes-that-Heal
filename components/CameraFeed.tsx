
import React, { useEffect, useRef } from 'react';

export const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera access denied:", err);
        }
      }
    }
    setupCamera();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 mix-blend-screen"
      style={{ filter: 'brightness(0.6) contrast(1.2)' }}
    />
  );
};
