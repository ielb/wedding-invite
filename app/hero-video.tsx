'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionPreference } from './motion-experience';

export default function HeroVideo({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { enabled, reducedMotion, ready } = useMotionPreference();
  const [ended, setEnded] = useState(false);
  const motionOn = enabled && !reducedMotion;

  // Derived during render rather than in an effect: toggling motion back on
  // replays the opening without a cascading re-render.
  const [wasMotionOn, setWasMotionOn] = useState(motionOn);
  if (wasMotionOn !== motionOn) {
    setWasMotionOn(motionOn);
    setEnded(false);
  }

  const isOpening = motionOn && !ended;
  // The server cannot read motion preferences. Keep its first frame separate
  // from the finished invitation so hydration never reveals then hides the names.
  const heroVideoClass = 'hero-video' + (!ready ? ' is-pending' : isOpening ? ' is-opening' : ' is-static');

  // Runs only once `is-opening` is on the DOM, so playback starts from frame 0
  // with the video already on screen instead of a second into the fade.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpening) return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      // Seeking right before play() aborts the request, so only rewind a clip
      // left parked at the end by a previous run.
      if (video.currentTime !== 0) video.currentTime = 0;
      void video.play().catch((error: DOMException) => {
        // Only a refused autoplay is fatal; an abort just means superseded.
        if (!cancelled && error.name === 'NotAllowedError') setEnded(true);
      });
    };

    // The element has only just mounted, so play() would race its own load.
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) start();
    else video.addEventListener('canplay', start, { once: true });

    return () => {
      cancelled = true;
      video.removeEventListener('canplay', start);
      video.pause();
    };
  }, [isOpening]);

  return (
    <div className={heroVideoClass}>
      <div className="hero-media" aria-hidden="true">
        {/* Mounted only while the opening runs: the clip ends on the same artwork that
            backs .hero-media, so unmounting it reveals an identical frame with no cut,
            and no zero-opacity video layer is left sitting over the hero. */}
        {isOpening && (
          <video
            ref={videoRef}
            className="invitation-video"
            muted
            playsInline
            preload="auto"
            poster="/images/closed-invitation.webp"
            onEnded={() => setEnded(true)}
            onError={() => setEnded(true)}
          >
            <source src="/videos/invitation-opening.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      {isOpening && <button className="video-skip" type="button" onClick={() => setEnded(true)}>تخطّي المقدمة</button>}
      {children}
    </div>
  );
}
