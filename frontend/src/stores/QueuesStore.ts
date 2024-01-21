import {makeAutoObservable} from "mobx"
import axios from "axios";
import {QueueInfoType} from "../models/queues";

export interface IQueuesStore {
    queues: QueueInfoType[]
}

class QueuesStore implements IQueuesStore {
    private rootStore: unknown

    queues = []
    totalQueuesCount = 0

    // TODO: fix deps cycle
    constructor(rootStore: unknown) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    fetchQueuesList = async (serverId: number): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/rabbit/queues/?server_id=${serverId}`,

            )
            if (resp.status === 200) {
                this.queues = resp.data.queues
                this.totalQueuesCount = resp.data.total
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }

}

export default QueuesStore
