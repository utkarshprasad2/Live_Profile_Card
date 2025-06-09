import { useEffect, useRef } from 'react';
import { initLynx, registerComponent } from '@lynx/core';
import { FollowerCounter } from './FollowerCounter.lynx';

// Initialize Lynx
let lynxInitialized = false;

async function initializeLynx() {
  if (lynxInitialized) return;
  
  try {
    await initLynx({
      debug: process.env.NODE_ENV === 'development',
      components: [FollowerCounter]
    });
    lynxInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Lynx:', error);
  }
}

// React component for Follower Counter
export function LynxFollowerCounter({ value, previousValue }: { value: number; previousValue: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeLynx().then(() => {
      if (containerRef.current) {
        const counter = document.createElement('follower-counter');
        counter.setAttribute('value', value.toString());
        counter.setAttribute('previous-value', previousValue.toString());
        containerRef.current.appendChild(counter);

        return () => {
          counter.remove();
        };
      }
    });
  }, [value, previousValue]);

  return <div ref={containerRef} />;
}

// React hook for Lynx animations
export function useLynxAnimation(options: {
  type: 'counter' | 'scale' | 'fade';
  initialValue?: number;
  duration?: number;
  easing?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    initializeLynx().then(() => {
      if (ref.current) {
        // Apply Lynx animation properties
        ref.current.setAttribute('lynx-animation', options.type);
        if (options.duration) {
          ref.current.setAttribute('lynx-duration', options.duration.toString());
        }
        if (options.easing) {
          ref.current.setAttribute('lynx-easing', options.easing);
        }
      }
    });
  }, [options.type, options.duration, options.easing]);

  return ref;
} 