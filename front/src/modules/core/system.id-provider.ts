import { IIDProvider } from "./id-provider";
import { nanoid } from "nanoid";

export class SystemIdProvider implements IIDProvider {
    generate() {
        return nanoid();
    }
}