'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionPreference } from './motion-experience';

export default function HeroVideo({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { enabled, reducedMotion } = useMotionPreference();
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showStaticArtwork = reducedMotion || !enabled || !ready || ended || failed;
  const isOpening = enabled && !reducedMotion && ready && !ended && !failed;
  const heroVideoClass = 'hero-video' + (showStaticArtwork ? ' is-static' : ' is-opening');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setReady(false);
    setFailed(false);
    setEnded(!enabled || reducedMotion);

    if (!enabled || reducedMotion) return;

    const startPlayback = () => {
      setReady(true);
      void video.play().catch(() => {
        setFailed(true);
        setEnded(true);
      });
    };

    video.currentTime = 0;
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) startPlayback();
    else video.addEventListener('canplay', startPlayback, { once: true });

    return () => {
      video.removeEventListener('canplay', startPlayback);
      video.pause();
    };
  }, [enabled, reducedMotion]);

  const skipIntro = () => {
    const video = videoRef.current;
    video?.pause();
    setReady(true);
    setEnded(true);
  };

  return (
    <div className={heroVideoClass}>
      <div className="hero-media" aria-hidden="true">
        <Image className="arch-image" src="/images/tetouan-arch.webp" width={1024} height={1536} alt="" unoptimized priority />
        <video
          ref={videoRef}
          className="invitation-video"
          muted
          playsInline
          preload="metadata"
          onEnded={() => setEnded(true)}
          onError={() => {
            setFailed(true);
            setEnded(true);
          }}
        >
          <source src="/videos/invitation-opening.mp4" type="video/mp4" />
        </video>
      </div>
      {isOpening && <button className="video-skip" type="button" onClick={skipIntro}>تخطّي المقدمة</button>}
      {children}
    </div>
  );
}
