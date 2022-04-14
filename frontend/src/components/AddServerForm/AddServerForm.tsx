import React, {VFC} from "react";
import {Box, Button, FormControl, FormGroup, Grid, Modal, Paper, TextField, Toolbar, Typography} from "@mui/material";

import {Save} from "@mui/icons-material";
import {observer} from "mobx-react";
import styles from "./AddServerForm.module.scss";
import {useStores} from "../../hooks";


interface IAddServerFormProps {
    handleClose: () => void
}


const AddServerForm: VFC<IAddServerFormProps> = ({handleClose}) => {
    const {
        newServerFormStore: {
            host,
            name,
            port,
            username,
            password,
            onChangeHost,
            onChangePassword,
            onChangePort,
            onChangeUsername,
            onChangeName,
            onSubmit

        },
    } = useStores()

    const submitHandler = async () =>{
        await onSubmit()
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
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="server name"
                                value={name}
                                onChange={onChangeName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="host"
                                required
                                value={host}
                                onChange={onChangeHost}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="port"
                                type="number"
                                defaultValue="5672"
                                value={port}
                                onChange={onChangePort}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="username"
                                required
                                value={username}
                                onChange={onChangeUsername}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="password"
                                type="password"
                                required
                                value={password}
                                onChange={onChangePassword}
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
    );
}


export default observer(AddServerForm);