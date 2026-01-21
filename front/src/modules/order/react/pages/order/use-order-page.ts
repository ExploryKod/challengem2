import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { useAppDispatch } from '@taotask/modules/store/store';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import gsap from "gsap"; 


export const useOrderPage = () => {
    const dispatch = useAppDispatch();

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

    function displayRestaurants() {
        const newState = {
            restaurants: [
                { id:"1", restaurantName: 'Triviala', restaurantType: 'Italien', stars: 6}, 
                { id:"2", restaurantName: 'Chez Marie', restaurantType: 'Provençal', stars: 5},
                { id:"3", restaurantName: 'Chez Tom', restaurantType: 'Cuisine du Ventoux', stars: 5}],
            restaurantId: ""
        } as OrderingDomainModel.RestaurantList;
        setRestaurantList(newState);
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