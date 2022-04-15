import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import {Button, Container, List, MenuList} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {FC, useEffect, useState} from "react";
import {observer} from "mobx-react";
import {Outlet} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import AddServerForm from "./components/AddServerForm/AddServerForm";
import {useStores} from "./hooks";
import ServerList from "./components/ServersList/ServerList";

const mdTheme = createTheme();

const App: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const {serversStore} = useStores()

    useEffect(() => {
        serversStore.fetchServersList()
    }, [])

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Sidebar>
                    <List >
                        {/* start sidebar*/}
                        <ServerList servers={serversStore.servers}/>

                        <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>} onClick={() => {
                            setIsModalOpen(true)
                        }}>Add server</Button>
                    </List>
                    {/* end sidebar*/}
                </Sidebar>
                {/*TODO: move to sidebar?*/}
                    {isModalOpen && <AddServerForm handleClose={() => {
                        setIsModalOpen(false)
                    }}/>}
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default observer(App);