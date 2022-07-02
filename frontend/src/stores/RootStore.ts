import NewServerFormStore from "./forms/NewServerFormStore";
import ServersStore from "./ServersStore";
import ServerStore from "./ServerStore";
import QueuesStore from "./QueuesStore";
import QueueStore from "./QueueStore";

export default class RootStore {
    newServerFormStore: NewServerFormStore;

    serversStore: ServersStore;

    serverStore: ServerStore;

    queuesStore: QueuesStore;

    queueStore: QueueStore;

    constructor() {
        // this needed to reference other stores inside
        this.newServerFormStore = new NewServerFormStore(this);
        this.serversStore = new ServersStore(this);
        this.serverStore = new ServerStore(this);
        this.queuesStore = new QueuesStore(this);
        this.queueStore = new QueueStore(this);
    }
}