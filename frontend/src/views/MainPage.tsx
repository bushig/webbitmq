import React, {VFC} from "react";
import {Button} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

// import RabbitForm from '../components/RabbitForm';

const MainPage: VFC = () =>
    (<>
        {/*<h1>Если не работают нотификации при новых событиях</h1>*/}
        {/*<h3>MAC OS</h3>*/}
        {/*Открываем системные настройки и включаем уведомления*/}
        {/*system preferences - Notifications & Focus - (Тут выбираем браузер) - Allow Notification*/}
        {/*<br/>*/}
            <Button href={"https://github.com/bushig/webbitmq"} variant="contained"startIcon={<GitHubIcon />}>Исходники на github</Button>

    </>);


export default MainPage;