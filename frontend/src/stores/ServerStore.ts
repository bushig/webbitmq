import {makeAutoObservable} from "mobx"
import axios from "axios";
import {ServerInfoType} from "../models/servers";

export interface IServerStore {
    activeServerId: number | null
    activeServerInfo: ServerInfoType | null
}

class ServerStore implements IServerStore {
    private rootStore: unknown

    activeServerId = null

    activeServerInfo = null

    // TODO: fix deps cycle
    constructor(rootStore: unknown) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    fetchServerMeta = async (id: number): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/management/servers/${id}`,
            )
            if (resp.status === 200) {
                this.activeServerInfo = resp.data
                this.activeServerId = resp.data.id
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }


}

export default ServerStore
