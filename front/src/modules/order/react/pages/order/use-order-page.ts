import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { useAppDispatch } from '@taotask/modules/store/store';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';
import gsap from "gsap"; 


export const useOrderPage = () => {
    const dispatch = useAppDispatch();
    const dependencies = useDependencies();

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

    async function displayRestaurants() {
        try {
            const restaurants = await dependencies.restaurantGateway?.getRestaurants() || [];
            const newState = {
                restaurants,
                restaurantId: ""
            } as OrderingDomainModel.RestaurantList;
            setRestaurantList(newState);
        } catch (error) {
            console.error('Failed to fetch restaurants:', error);
            const newState = {
                restaurants: [],
                restaurantId: ""
            } as OrderingDomainModel.RestaurantList;
            setRestaurantList(newState);
        }
    }

 
    function selectRestaurant(id:string) {
        setRestaurantList({...restaurantList, restaurantId: id});
        dispatch(orderingActions.setRestaurantId(id));
    }

    /** Manage states, ref & gsap **/
    const animText = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPTimeline>()
    const [restaurantList, setRestaurantList] = useState<OrderingDomainModel.RestaurantList>({restaurants:[], restaurantId: ""});
    const [toggle, setToggle] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);

   
    /** UseEffects */
 
    useEffect (() => {
        displayRestaurants();
    }, []);

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
        selectRestaurant,
        restaurantList,
        animText
    };
}