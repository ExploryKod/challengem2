import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore } from "@taotask/modules/store/store";
import { InMemoryParcoursGateway } from "../welcome/core/gateway-infra/in-memory-gateway";
export class App {
  public dependencies: Dependencies;
  public store: AppStore;

  constructor() {
    this.dependencies = this.setupDependencies();
    this.store = createStore({ dependencies: this.dependencies });
  }

  setupDependencies(): Dependencies {
    return {
      idProvider: new SystemIdProvider(),
      parcoursGateway: new InMemoryParcoursGateway(),
    };
  }
}

export const app = new App();
