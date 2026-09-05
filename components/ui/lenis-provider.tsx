"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import Lenis from "lenis";

type LenisContextValue = {
  scroll: number;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisContextValue>({
  scroll: 0,
  stop: () => {},
  start: () => {},
});

export const useLenisScroll = () => useContext(LenisContext);

export function LenisProvider({ children }: PropsWithChildren) {
  const lenis = useRef<Lenis | null>(null);
  const [scroll, setScroll] = useState(0);

  const stop = () => lenis.current?.stop();
  const start = () => lenis.current?.start();

  useEffect(() => {
    lenis.current = new Lenis({
      lerp: 0.18,
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.2,
    });

    lenis.current.on("scroll", ({ scroll }) => {
      setScroll(scroll);
    });

    const raf = (time: number) => {
      lenis.current?.raf(time);
      window.requestAnimationFrame(raf);
    };

    window.requestAnimationFrame(raf);

    return () => {
      lenis.current?.destroy();
    };
  }, []);

  return <LenisContext.Provider value={{ scroll, stop, start }}>{children}</LenisContext.Provider>;
}
