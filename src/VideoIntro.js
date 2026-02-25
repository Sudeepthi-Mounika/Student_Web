import React, { useEffect, useState } from "react";

function VideoIntro({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 800);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`video-intro ${fadeOut ? "fade-out" : ""}`}>
      <div className="logo-wrapper">
        <div className="logo-circle">
          🎓
        </div>
        <h1 className="logo-title">Student Web Portal</h1>
      </div>
    </div>
  );
}

export default VideoIntro;