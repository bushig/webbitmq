import {makeAutoObservable} from "mobx"
import axios from "axios";
import {ServerInfoType} from "../models/servers";

export interface IServersStore {
    servers: ServerInfoType[]
}

class ServersStore implements IServersStore {
    private rootStore: unknown

    servers = []

    // TODO: fix deps cycle
    constructor(rootStore: unknown) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    fetchServersList = async (): Promise<void> => {
        try {
            const resp = await axios.get(
                `/api/management/servers/`,
            )
            if (resp.status === 200) {
                this.servers = resp.data
            }
            // TODO: handle errors
        } catch (e) {
            // TODO: handle errors
        }
    }


}

export default ServersStore
