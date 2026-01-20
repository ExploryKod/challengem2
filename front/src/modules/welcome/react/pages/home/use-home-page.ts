import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from "gsap";
import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";
import { useDependencies } from "@taotask/modules/app/react/DependenciesProvider";
import { getParcoursList } from "@taotask/modules/welcome/core/useCase/get-parcours.usecase";

export const useHomePage = () => {
    const dependencies = useDependencies();

    /** Variables and Functions **/

    const goToParcoursSectionBottom = (toggle: boolean) => {
        if(bottomRef.current && toggle) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const showParcoursSection = () => {
        setToggle(true);
        setTimeout(() => {
            goToParcoursSectionBottom(true);
        }, 100);
    };

    function selectParcours(id: string) {
        setParcoursList({...parcoursList, parcoursId: id});
    }

    /** Manage states, ref & gsap **/
    const animText = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline>()
    const [toggle, setToggle] = useState<boolean>(false);
    const [parcoursList, setParcoursList] = useState<WelcomingDomainModel.ParcoursList>({
        parcours: [],
        parcoursId: ""
    });
    const bottomRef = useRef<HTMLDivElement>(null);

   
    /** UseEffects */

    useEffect(() => {
        async function loadParcours() {
            try {
                const parcoursData = await getParcoursList(dependencies);
                
                if (!dependencies.parcoursGateway) {
                    console.error("ParcoursGateway is not available - using empty list");
                }
                
                setParcoursList(parcoursData);
            } catch (error) {
                console.error("Error fetching parcours:", error);
                setParcoursList({
                    parcours: [],
                    parcoursId: ""
                });
            }
        }
        loadParcours();
    }, [dependencies]);
 
    useEffect(() => {
        goToParcoursSectionBottom(toggle);
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
        isParcoursSectionVisible: toggle,
        showParcoursSection,
        bottomRef,
        selectParcours,
        parcoursList,
        animText
    };
}