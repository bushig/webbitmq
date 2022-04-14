import NewServerFormStore from "./forms/NewServerFormStore";
import ServersStore from "./ServersStore";

export default class RootStore {
    newServerFormStore: NewServerFormStore;

    serversStore: ServersStore;

    constructor() {
        // this needed to reference other stores inside
        this.newServerFormStore = new NewServerFormStore(this);
        this.serversStore = new ServersStore(this);
    }
}