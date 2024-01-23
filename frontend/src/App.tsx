import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {Button, List} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {observer} from "mobx-react";
import {Outlet} from "react-router-dom";
import {ruRU} from '@mui/material/locale';
import Sidebar from "./components/Sidebar/Sidebar";
import AddServerForm from "./components/AddServerForm/AddServerForm";
import {useStores} from "./hooks";
import ServerList from "./components/ServersList/ServerList";


const mdTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: "#478cc8",
            },
            secondary: {
                main: "#478cc8",
            },
        },
        components: {
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            backgroundColor: "rgba(71, 140, 200, 0.35)",
                        }
                    }

                }
            }
        }

    },
    ruRU
);

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
                    <List>
                        {/* start sidebar*/}
                        <ServerList servers={serversStore.servers}/>

                        <Button style={{margin: 10}} variant="contained" color="secondary" startIcon={<AddCircleIcon/>} onClick={() => {
                            setIsModalOpen(true)
                        }}>Добавить сервер</Button>
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
                    <Outlet/>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default observer(App);