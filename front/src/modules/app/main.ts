import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore } from "@taotask/modules/store/store";


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
    };
  }
}

export const app = new App();
