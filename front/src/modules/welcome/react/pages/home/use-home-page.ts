import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from "gsap"; // <-- import GSAP
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";

export const  useHomePage = () => {

    /** Variables and Functions **/

    const goToGuestSectionBottom = (toggle: boolean) => {
        if(bottomRef.current && toggle) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const showGuestSection = () => {
        setToggle(true);
        goToGuestSectionBottom(toggle);
    };

    /** Manage states, ref & gsap **/
    const animText = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline>()
    const [toggle, setToggle] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);

   
    /** UseEffects */
 
    useEffect(() => {
        goToGuestSectionBottom(toggle);
    }, [toggle]);

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
        isGuestSectionVisible: toggle,
        showGuestSection,
        bottomRef,
        animText
    };
}