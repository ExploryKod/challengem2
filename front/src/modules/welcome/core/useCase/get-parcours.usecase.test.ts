import { getParcoursList } from "@taotask/modules/welcome/core/useCase/get-parcours.usecase";
import { StubParcoursGateway } from "@taotask/modules/welcome/core/testing/stub.parcours-gateway";
import { FailingParcoursGateway } from "@taotask/modules/welcome/core/testing/failing.parcours-gateway";
import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";

describe("Get parcours list", () => {
    it("Should fetch parcours list", async () => {
        const expectedParcours: WelcomingDomainModel.ParcoursList = {
            parcours: [
                {
                    id: "1",
                    text: "Test parcours",
                    link: "/test",
                    image: {
                        url: "/test.jpg",
                        alt: "Test",
                        title: "Test Parcours"
                    }
                }
            ],
            parcoursId: ""
        };

        const dependencies = {
            parcoursGateway: new StubParcoursGateway(expectedParcours)
        };

        const result = await getParcoursList(dependencies);

        expect(result).toEqual(expectedParcours);
        expect(result.parcours).toHaveLength(1);
        expect(result.parcours[0].id).toBe("1");
    });

    it("Should return empty list when gateway is not available", async () => {
        const dependencies = {
            parcoursGateway: undefined
        };

        const result = await getParcoursList(dependencies);

        expect(result).toEqual({
            parcours: [],
            parcoursId: ""
        });
    });

    it("Should handle fetching parcours errors", async () => {
        const dependencies = {
            parcoursGateway: new FailingParcoursGateway()
        };

        await expect(getParcoursList(dependencies)).rejects.toThrow("Failed to fetch parcours");
    });


    it("Should return empty list when parcours array is empty", async () => {
        const emptyParcours: WelcomingDomainModel.ParcoursList = {
            parcours: [],
            parcoursId: ""
        };

        const dependencies = {
            parcoursGateway: new StubParcoursGateway(emptyParcours)
        };

        const result = await getParcoursList(dependencies);

        expect(result.parcours).toHaveLength(0);
        expect(result.parcoursId).toBe("");
    });


});