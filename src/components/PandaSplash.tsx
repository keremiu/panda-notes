import { useState, useEffect } from 'react';
import './PandaSplash.css';

interface PandaSplashProps {
  onComplete: () => void;
}

export default function PandaSplash({ onComplete }: PandaSplashProps) {
  const [currentText, setCurrentText] = useState(0);

  const texts = [
    'Yükleniyor...',
    'Panda bambuyu yiyor...',
    'Panda etrafa bakıyor...'
  ];

  useEffect(() => {
    // Her ~1.6 saniyede bir metin değiştir (toplam 5 saniye için)
    const textInterval = setInterval(() => {
      setCurrentText((prev) => {
        if (prev < texts.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1600);

    return () => clearInterval(textInterval);
  }, [texts.length]);

  const handleVideoEnd = () => {
    // Video bitince kısa bir gecikme ile tamamla
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="panda-splash">
      <div className="panda-splash-content">
        <div className="video-container">
          <video
            className="panda-video"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src="/panda_animasyon.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="loading-text-container">
          <p className="loading-text pixel-text">{texts[currentText]}</p>
        </div>
      </div>
    </div>
  );
}

