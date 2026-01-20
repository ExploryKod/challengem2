import { IIDProvider } from "@taotask/modules/core/id-provider";

export class StubIdProvider implements IIDProvider {
    generate() {
        return "1";
    }
}