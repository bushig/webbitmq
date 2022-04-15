import NewServerFormStore from "./forms/NewServerFormStore";
import ServersStore from "./ServersStore";
import ServerStore from "./ServerStore";

export default class RootStore {
    newServerFormStore: NewServerFormStore;

    serversStore: ServersStore;

    serverStore: ServerStore;

    constructor() {
        // this needed to reference other stores inside
        this.newServerFormStore = new NewServerFormStore(this);
        this.serversStore = new ServersStore(this);
        this.serverStore = new ServerStore(this);
    }
}