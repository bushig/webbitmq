import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import {Button, Container} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useState} from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import AddServerForm from "./components/AddServerForm/AddServerForm";

const mdTheme = createTheme();

function DashboardContent() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Sidebar>
                    <>
                        {/* start sidebar*/}
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Servers list"/>
                        </ListItem>
                        <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={()=>{setIsModalOpen(true)}}>Add server</Button>
                    </>
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
                    {isModalOpen && <AddServerForm/> }


                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent/>;
}