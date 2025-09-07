"use client"
import { useEffect, useState } from "react";

export function useCanvasSize(ref: React.RefObject<HTMLCanvasElement>) {
  const [size, setSize] = useState({ width: 500, height: 400 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight; // default se não tiver altura
      canvas.width = width;
      canvas.height = height;

      setSize({ width, height });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  return size;
}
