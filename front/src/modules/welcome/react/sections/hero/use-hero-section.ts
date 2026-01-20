import { useState, useEffect } from 'react';

type MyFonts = "font-mono" | "font-oswald" | "font-inter";

function getRandomName(names:Array<string>):string {
    var randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

export const useHeroSection = () => {
    
    const [font, setFont] = useState<string>("");
    
    useEffect(() => {
        const fonts:Array<MyFonts> = ["font-mono","font-oswald","font-inter"];
        setFont(getRandomName(fonts));
    }, []);
    return {
      font,
    }
}