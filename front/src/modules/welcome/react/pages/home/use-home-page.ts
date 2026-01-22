import { useRef, useLayoutEffect } from 'react';
import gsap from "gsap";

export const useHomePage = () => {
    const animText = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline | undefined>(undefined);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
          tl.current = gsap.timeline()
            .fromTo(".title", { y: -50, opacity: 0 },
            {
              y: 0,
              duration: 1,
              opacity: 1,
            })
            .to(".button", { duration: 0.5, opacity: 1 });
        }, animText);

        return () => ctx.revert()
    }, [])

    return {
        animText
    };
}
