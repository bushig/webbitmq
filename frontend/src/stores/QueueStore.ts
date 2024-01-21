// @ts-nocheck
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
        makeAutoObservable(this, {})
    }

    fetchQueueMeta = async (uuid: string): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/rabbit/queues/${uuid}`,
            )
            if (resp.status === 200) {
                this.activeQueueInfo = resp.data
                this.activeQueueUuid = resp.data.uuid
                this.rootStore.serverStore.activeServerId = resp.data.rabbit_server_id
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
                this.setAllmessages(resp.data.reverse())
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }

    addMessage = (message: any): void => {
        message.isHighlighted = true
        this.messages = [...this.messages, message]
    }

    setHighlightedFalse = (position: number): void => {
        console.log(`SETTING ${position}`)
        this.messages[position].isHighlighted = false
    }
    setAllmessages(messages: any): void {
        this.messages = messages
    }
    get bindingsForCopy(){
        return this.activeQueueInfo?.bindings.map((binding) => ({
                exchange: binding.exchange_name,
                routing_key: binding.routing_key
            }))
    }
    get messagesCount(){
        return this.messages.length
    }


}

export default QueueStore
