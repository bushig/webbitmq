import React, {VFC} from "react";
import {Box, Button, FormControl, FormGroup, Grid, Modal, Paper, TextField, Toolbar, Typography} from "@mui/material";

import {Save} from "@mui/icons-material";
import styles from "./AddServerForm.module.scss";


const AddServerForm: VFC = () => (
    <Modal open>
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
                            // value={name}
                            // onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="host"
                            required
                            // value={name}
                            // onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="port"
                            type="number"
                            defaultValue="5672"
                            // value={name}
                            // onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="username"
                            required
                            // value={name}
                            // onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="password"
                            type="password"
                            required
                            // value={name}
                            // onChange={handleChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="vhost"
                            defaultValue="/"
                            // value={name}
                            // onChange={handleChange}
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
                    // onClick={}
                >
                    Save
                </Button>
            </div>
        </Box>
    </Modal>
)


export default AddServerForm;