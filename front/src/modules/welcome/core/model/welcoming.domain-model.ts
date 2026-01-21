export namespace WelcomingDomainModel {
    
    export type ParcoursId = string;
    export type Image = {
        url: string,
        alt: string,
        title: string
    }
    export type Parcours = {
        id: ParcoursId,
        text: string,
        link: string,
        image: Image
    }   



    export type ParcoursList = {
        parcours: Parcours[],
        parcoursId: ParcoursId
    }
}