import ServersStore from "./ServersStore";
import ServerStore from "./ServerStore";
import QueuesStore from "./QueuesStore";
import QueueStore from "./QueueStore";

export default class RootStore {

    serversStore: ServersStore;

    serverStore: ServerStore;

    queuesStore: QueuesStore;

    queueStore: QueueStore;

    constructor() {
        // this needed to reference other stores inside
        this.serversStore = new ServersStore(this);
        this.serverStore = new ServerStore(this);
        this.queuesStore = new QueuesStore(this);
        this.queueStore = new QueueStore(this);
    }
}