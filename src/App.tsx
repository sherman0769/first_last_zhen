import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const captureFrame = (time: number) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const originalTime = video.currentTime;
        const wasPaused = video.paused;

        const drawImageAndDownload = () => {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          // Use a more descriptive filename
          link.download = `frame_at_${Math.round(time)}s.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          video.onseeked = null; // Clean up the event listener
          video.currentTime = originalTime;
          if (!wasPaused) {
            // Resume playback if the video was playing
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }
        };

        video.onseeked = drawImageAndDownload;
        video.currentTime = time;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(videoRef.current){
      const time = parseFloat(event.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }

  return (
    <div className="App">
      <h1>影片影格擷取工具</h1>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <p>拖曳影片到這裡，或點擊選擇檔案</p>
        <input
          id="file-input"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {videoSrc && (
        <div className="video-container">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}
          ></video>
          
          <div className="timeline-slider">
            <input 
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={handleSliderChange}
            />
          </div>

          <div className="controls">
            <button onClick={() => captureFrame(0)}>擷取首幀</button>
            <button onClick={() => captureFrame(currentTime)}>擷取當前幀</button>
            <button onClick={() => captureFrame(duration)}>擷取尾幀</button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default App;
