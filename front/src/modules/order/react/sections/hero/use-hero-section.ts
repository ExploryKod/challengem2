// Fichier fait par moi = A REFACTO
import { set } from 'husky';
import { useState, useEffect } from 'react';

type MyFonts = "font-mono" | "font-oswald" | "font-inter";
// Function to generate a random name
function getRandomName(names:Array<string>):string {
    var randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

export const useHeroSection = () => {
    // Array of fonts
    const [font, setFont] = useState<string>("");
    
    useEffect(() => {
        const fonts:Array<MyFonts> = ["font-mono","font-oswald","font-inter"];
        setFont(getRandomName(fonts));
    }, []);
    return {
      font,
    }
}