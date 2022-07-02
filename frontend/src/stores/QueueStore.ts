import {makeAutoObservable} from "mobx"
import axios from "axios";
import {QueueInfoType} from "../models/queues";

export interface IQueueStore {
    activeQueueUuid: number | null
    activeQueueInfo: QueueInfoType | null

    messages: string[]
}

class QueueStore implements IQueueStore {
    private rootStore: unknown

    activeQueueUuid = null

    activeQueueInfo = null

    messages = []

    // TODO: fix deps cycle
    constructor(rootStore: unknown) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    fetchQueueMeta = async (uuid: string): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/rabbit/queues/${uuid}`,
            )
            if (resp.status === 200) {
                this.activeQueueInfo = resp.data
                this.activeQueueUuid = resp.data.uuid
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }

    fetchMessagesList = async (): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/rabbit/queues/${this.activeQueueUuid}/messages`,

            )
            if (resp.status === 200) {
                this.messages = resp.data
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }

    addMessage = async (message: any): Promise<void> => {
        this.messages = [...this.messages, message]
    }


}

export default QueueStore
