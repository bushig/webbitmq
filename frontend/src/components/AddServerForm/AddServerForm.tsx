import React, {VFC} from "react";
import {Box, Modal, Toolbar, Typography} from "@mui/material";

import {RJSFSchema} from '@rjsf/utils';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import {observer} from "mobx-react";
import axios from "axios";
import styles from "./AddServerForm.module.scss";
import {useStores} from "../../hooks";


interface IAddServerFormProps {
    handleClose: () => void
}

// taken from RabbitServerCreate backend openapi, dont edit
const schema: RJSFSchema = {
    "title": "RabbitServerCreate",
    "required": [
        "name",
        "host",
        "username",
        "password",
        "port"
    ],
    "type": "object",
    "properties": {
        "name": {
            "title": "Name",
            "maxLength": 125,
            "type": "string"
        },
        "host": {
            "title": "Host",
            "maxLength": 255,
            "type": "string"
        },
        "username": {
            "title": "Username",
            "maxLength": 255,
            "type": "string"
        },
        "password": {
            "title": "Password",
            "maxLength": 255,
            "type": "string"
        },
        "port": {
            "title": "Port",
            "maximum": 2147483647,
            "minimum": -2147483648,
            "type": "integer"
        },
        "vhost": {
            "title": "Vhost",
            "maxLength": 255,
            "type": "string",
            "default": "/",
            // "nullable": true
        }
    },
    "additionalProperties": false
}



const AddServerForm: VFC<IAddServerFormProps> = ({handleClose}) => {
    const {
        serversStore : {fetchServersList}
    } = useStores()

    const submitHandler = async (data, event) =>{
        // data.
        console.log(data.formData, "data")
        try {
            const resp = await axios.post(
                `/api/management/servers/`,
                data.formData,
            )
            if (resp.status === 200) {
                fetchServersList()
                handleClose()
                // TODO: refetch servers list
                // TODO: redirect on server page
                // this.result = resp.data.result
            } else {
                // TODO: set error
            }
        } catch (e) {
            // TODO: set error
        }
    }

    return (
        <Modal open onClose={handleClose}>
            <Box className={styles.wrapper} bgcolor='background.paper' p="4">
                <Toolbar className={styles.header}>
                    <Typography variant="h6" color="inherit">
                        New connection
                    </Typography>
                </Toolbar>
                <div className={styles.form}>
                    <Form
                        schema={schema}
                        validator={validator}
                        onSubmit={submitHandler}
                    />
                </div>
            </Box>
        </Modal>
    );
}


export default observer(AddServerForm);