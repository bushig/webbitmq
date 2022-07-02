import React, {FC, useState} from "react";

import axios from "axios";
import {observer} from "mobx-react";
import {Box, Button, Grid, Modal, TextField, Toolbar, Typography} from "@mui/material";
import {Save} from "@mui/icons-material";
import {useStores} from "../../hooks";
import styles from "../AddServerForm/AddServerForm.module.scss";
import {MessageType} from "../../models/queues";

type AddQueueFormProps = {
    handleClose: () => void
}

const AddQueueForm: FC<AddQueueFormProps> = (props) => {
    const {serverStore} = useStores()
    const {handleClose} = props

    const [error, setError] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);

    const [exchangeName, setExchangeName] = useState<string>("");
    const [queueLifetimeMinutes, setQueueLifetimeMinutes] = useState<number>(1);
    const [routingKey, setRoutingKey] = useState<string>("");


    const handleExchangeNameChange = (e) => {
        console.log("qweqwe", e)
        setExchangeName(e.target.value);
    };

    const handleRoutingKeyChange = (e) => {
        setRoutingKey(e.target.value);
    };
    const handleQueueLifetimeMinutesChange = (e) => {
        setQueueLifetimeMinutes(e.target.value);
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const data = {
                rabbit_server_id: serverStore.activeServerId,
                exchange_name: exchangeName,
                routing_key: routingKey || "*",
                ttl_minutes: queueLifetimeMinutes
            };
            const response = await axios.post(
                `/api/rabbit/queues/`,
                data
            );
            window.open(`/queue/${response.data.uuid}`);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setError(err.toString());
            setLoading(false);
        }
    };

    return (
        <form>
            <Modal open onClose={handleClose}>
                <Box className={styles.wrapper} bgcolor='background.paper' p="4">
                    <Toolbar className={styles.header}>
                        <Typography variant="h6" color="inherit">
                            New queue
                        </Typography>
                    </Toolbar>
                    <div className={styles.form}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="exchange name"
                                    value={exchangeName}
                                    onChange={handleExchangeNameChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="routing key"
                                    required
                                    value={routingKey}
                                    onChange={handleRoutingKeyChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="ttl minutes"
                                    type="number"
                                    defaultValue="5672"
                                    value={queueLifetimeMinutes}
                                    onChange={handleQueueLifetimeMinutesChange}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div className={styles.actions}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Save/>}
                            // className={classes.button}
                            onClick={onSubmit}
                        >
                            Save
                        </Button>
                    </div>
                </Box>
            </Modal>
        </form>
    );
};

export default observer(AddQueueForm);