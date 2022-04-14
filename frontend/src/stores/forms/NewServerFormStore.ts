import {makeAutoObservable} from "mobx"
import React from "react";
import axios from "axios";

export interface INewServerFormStore {
    name: string
    host: string
    port: string
    username: string
    password: string

    result: string

}

class NewServerFormStore implements INewServerFormStore {
    private rootStore: unknown

    name = ""

    host = ""

    port = ""

    username = ""

    password = ""

    result = ""

    // TODO: fix deps cycle
    constructor(rootStore: unknown) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    onChangeName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.name = event.target.value
    }

    onChangeHost: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.host = event.target.value
    }

    onChangePort: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.port = event.target.value
    }

    onChangeUsername: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.username = event.target.value
    }

    onChangePassword: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.password = event.target.value
    }

    onSubmit = async (): Promise<void> => {
        try {
            const resp = await axios.post(
                `/api/management/servers/`,
                {
                    host: this.host,
                    port: this.port,
                    name: this.name,
                    username: this.username,
                    password: this.password,
                },
            )
            if (resp.status === 200) {
                // TODO: redirect on server page
                this.result = resp.data.result
            } else {
                this.result = "error"
            }
        } catch (e) {
            this.result = "error"
        }
    }


}

export default NewServerFormStore
