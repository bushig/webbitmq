import React, {FC, useState} from "react";

import axios from "axios";
import {observer} from "mobx-react";
import {Box, Modal} from "@mui/material";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import {RJSFSchema} from "@rjsf/utils";
import {useStores} from "../../hooks";
import styles from "../AddServerForm/AddServerForm.module.scss";

type AddQueueFormProps = {
    handleClose: () => void
    bindings?: unknown
}

// taken from RabbitServerCreate backend openapi, dont edit
const schema: RJSFSchema = {
    "title": "Новая очередь",
    "required": [
        "rabbit_server_id",
        "ttl_minutes"
    ],
    "type": "object",
    "properties": {
        "rabbit_server_id": {
            "title": "Rabbit Server Id",
            "type": "integer"
        },
        "bindings": {
            "title": "Bindings",
            "minItems": 1,
            "type": "array",
            "items": {
                "title": "Параметры привязки",
                "required": [
                    "exchange",
                    // "routing_key"
                ],
                "type": "object",
                "properties": {
                    "exchange": {
                        "title": "Exchange",
                        "type": "string"
                    },
                    "routing_key": {
                        "title": "Routing Key",
                        "type": "string",
                        "description":"Для эксченжей типа topic можно использовать wildcard. Например users.*"
                    }
                },
                "description": "Для эксченжей типа topic можно использовать wildcard. Например users.*"
            },
            "description": "Bindings of queue to exchange",
            "default": []
        },
        "ttl_minutes": {
            "title": "TTL in Minutes",
            "type": "integer",
            "description": "Время жизни очереди в минутах"
        }
    }
}

const uiSchema: RJSFSchema = {
    rabbit_server_id: {"ui:widget": "hidden"},

    bindings: {
        'ui:options': {
            orderable: false,
            label: false,
        },
        items: {
            routing_key: {
                "ui:emptyValue": "",
            }
        }
    }
};

const AddQueueForm: FC<AddQueueFormProps> = (props) => {
    const {serverStore} = useStores()
    const {handleClose} = props
    let {bindings} = props
    // alert(JSON.stringify(bindings))
    bindings = !!bindings ? bindings : [{}]

    const [extraErrors, setExtraErrors] = useState({});

    const submitHandler = async (data) => {
        try {
            const response = await axios.post(
                `/api/rabbit/queues/`,
                data.formData
            );
            window.open(`/server/${data.formData.rabbit_server_id}/queue/${response.data.uuid}`);
        } catch (err) {
            // case when exchanges are not available
            setExtraErrors({
                bindings: {
                    __errors: [err.response.data.detail],
                },
            })
        }
    };

    return (
        <Modal open onClose={handleClose}>
            <Box className={styles.wrapper} bgcolor='background.paper' p="4">
                <div className={styles.form}>
                    <Form
                        schema={schema}
                        validator={validator}
                        onSubmit={submitHandler}
                        uiSchema={uiSchema}
                        formData={{rabbit_server_id: serverStore.activeServerId, bindings: bindings, ttl_minutes: 10}}
                        // @ts-ignore
                        extraErrors={extraErrors}
                        noHtml5Validate={true}
                    />
                </div>
            </Box>
        </Modal>
    );
};

export default observer(AddQueueForm);