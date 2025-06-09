import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

interface LynxAnimationProps {
  followers: number;
  previousFollowers: number;
}

export function useLynxFollowerAnimation({ followers, previousFollowers }: LynxAnimationProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(previousFollowers);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Add Lynx-specific classes for styling
    node.classList.add('lynx-counter');
    
    if (followers > previousFollowers) {
      node.classList.add('lynx-increasing');
      node.classList.remove('lynx-decreasing');
    } else if (followers < previousFollowers) {
      node.classList.add('lynx-decreasing');
      node.classList.remove('lynx-increasing');
    }

    const controls = animate(previousFollowers, followers, {
      duration: 1,
      onUpdate(value) {
        setDisplayValue(Math.round(value));
      },
      ease: 'easeOut',
    });

    return () => {
      controls.stop();
      node.classList.remove('lynx-counter', 'lynx-increasing', 'lynx-decreasing');
    };
  }, [followers, previousFollowers]);

  return { ref: nodeRef, displayValue };
}

export function useLynxVideoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    // Add Lynx-specific classes
    node.classList.add('lynx-grid');

    // Add Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lynx-visible');
            // Add a staggered animation delay based on the index
            const index = Array.from(node.children).indexOf(entry.target as Element);
            (entry.target as HTMLElement).style.animationDelay = `${index * 0.1}s`;
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe all grid items
    Array.from(node.children).forEach((child) => {
      child.classList.add('lynx-grid-item');
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
      node.classList.remove('lynx-grid');
      Array.from(node.children).forEach((child) => {
        child.classList.remove('lynx-grid-item', 'lynx-visible');
      });
    };
  }, []);

  return gridRef;
}

// Add these styles to your globals.css
const styles = `
  .lynx-counter {
    transition: color 0.3s ease;
  }

  .lynx-counter.lynx-increasing {
    color: #22c55e;
  }

  .lynx-counter.lynx-decreasing {
    color: #ef4444;
  }

  .lynx-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .lynx-grid-item {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .lynx-grid-item.lynx-visible {
    opacity: 1;
    transform: scale(1);
  }
`; 