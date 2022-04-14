import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import {Button, Container, MenuList} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import Sidebar from "./components/Sidebar/Sidebar";
import AddServerForm from "./components/AddServerForm/AddServerForm";
import {useStores} from "./hooks";

const mdTheme = createTheme();

function App() {
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
                    <MenuList dense>
                        {/* start sidebar*/}
                        {serversStore.servers.map((server) => {
                            console.log("TESEET")
                            return (
                                <ListItem button key={server.id}>
                                    <ListItemText primary={server.name}/>
                                </ListItem>
                            );
                        })}

                        <Button variant="contained" color="secondary" startIcon={<AddCircleIcon/>} onClick={() => {
                            setIsModalOpen(true)
                        }}>Add server</Button>
                    </MenuList>
                    {/* end sidebar*/}
                </Sidebar>
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
                    Some features
                    <br/>
                    Some links
                    <br/>
                    Some changelogs
                    {isModalOpen && <AddServerForm handleClose={() => {
                        setIsModalOpen(false)
                    }}/>}


                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default observer(App);