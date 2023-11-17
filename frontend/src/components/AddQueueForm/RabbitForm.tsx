import React, {FC, useState} from "react";

import axios from "axios";
import {observer} from "mobx-react";
import {Box, Modal, Toolbar, Typography} from "@mui/material";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import {ErrorSchema, RJSFSchema} from "@rjsf/utils";
import {useStores} from "../../hooks";
import styles from "../AddServerForm/AddServerForm.module.scss";

type AddQueueFormProps = {
    handleClose: () => void
}

// taken from RabbitServerCreate backend openapi, dont edit
const schema: RJSFSchema = {
    "title": "RabbitQueueCreateSchema",
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
                "title": "RabbitBindings",
                "required": [
                    "exchange",
                    "routing_key"
                ],
                "type": "object",
                "properties": {
                    "exchange": {
                        "title": "Exchange",
                        "type": "string"
                    },
                    "routing_key": {
                        "title": "Routing Key",
                        "type": "string"
                    }
                },
                "description": "Bindings of queue to exchange"
            },
            "description": "Bindings of queue to exchange",
            "default": []
        },
        "ttl_minutes": {
            "title": "Ttl Minutes",
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
    }
};

const AddQueueForm: FC<AddQueueFormProps> = (props) => {
    const {serverStore} = useStores()
    const {handleClose} = props

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
                <Toolbar className={styles.header}>
                    <Typography variant="h6" color="inherit">
                        Новая очередь
                    </Typography>
                </Toolbar>
                <div className={styles.form}>
                    <Form
                        schema={schema}
                        validator={validator}
                        onSubmit={submitHandler}
                        uiSchema={uiSchema}
                        formData={{rabbit_server_id: serverStore.activeServerId}}
                        // @ts-ignore
                        extraErrors={extraErrors}
                    />
                </div>
            </Box>
        </Modal>
    );
};

export default observer(AddQueueForm);