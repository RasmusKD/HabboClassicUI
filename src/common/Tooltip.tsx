import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  isDraggable?: boolean;
  windowId?: string;
  tooltipWidth?: number;
  style?: React.CSSProperties;
}

export function Tooltip({ content, children, isDraggable, windowId, tooltipWidth }: TooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [delayHandler, setDelayHandler] = useState<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseMove(event: React.MouseEvent) {
    if (isDraggable) {
      const draggableWindow = document.getElementById(windowId);
      if (draggableWindow) {
        const { left, top } = draggableWindow.getBoundingClientRect();
        setPosition({ x: event.clientX - left, y: event.clientY - top });
      }
    } else {
      setPosition({ x: event.clientX, y: event.clientY });
    }
  }

  function handleMouseEnter() {
      setDelayHandler(setTimeout(() => {
        setVisible(true);
      }, 500));
    }

  function handleMouseLeave() {
      if (delayHandler) {
        clearTimeout(delayHandler);
      }
      setVisible(false);
    }

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const tooltip = tooltipRef.current;
      if (tooltip) {
        const { x, y, width, height } = tooltip.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y + 10,
    left: position.x + 20,
    display: visible ? 'block' : 'none',
    color: '#fff',
    borderImageSource: 'url("https://habboclassic.dk/hotel/nitro/images/additions/tooltip.png")',
    borderImageSlice: '5 fill',
    borderImageWidth: '5px',
    borderImageRepeat: 'repeat repeat',
    zIndex: '5',
    padding: '3px 5px',
    fontSize: '11px',
    width: 'max-content',
  };

  return (
    <span className='line-height-0' onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      {children}
      <div style={{ ...tooltipStyle, ...tooltipPosition(position, tooltipWidth), }} ref={tooltipRef}> {content} </div>
    </span>
  );
}

function tooltipPosition(position: { x: number; y: number }, tooltipWidth: number) {
  const tooltipHeight = 22;
  const padding = 1;
  const toolwidth = tooltipWidth;

  const { x, y } = position;
  const { innerWidth, innerHeight } = window;

  let left = x + 20 + padding;
  let top = y + padding;

  if (left + toolwidth > innerWidth) {
    left = innerWidth - toolwidth - padding;
    if (top + tooltipHeight > innerHeight) {
      top = innerHeight - tooltipHeight;
    } else {
      top = y + tooltipHeight + padding;
    }
  } else if (top + tooltipHeight > innerHeight) {
    top = innerHeight - tooltipHeight - padding;
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
}
