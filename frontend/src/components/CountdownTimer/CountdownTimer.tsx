import React, {VFC} from "react";
import Countdown from 'react-countdown';
import {Chip} from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import styles from "./CountdownTimer.module.scss";


type CountdownTimerProps = {
    dateEnd: Date
    compact?: boolean
}
const CountdownTimer: VFC<CountdownTimerProps> = ({dateEnd, compact}) => {
    const timerRenderer = ({hours, minutes, seconds, completed}) => {
        let text = `${hours}:${minutes}:${seconds} осталось`
        let color: 'success' | 'error' = "success"
        if (completed) {
            // Render a complete state
            text = "ПОТРАЧЕНО";
            color = "error"
        }
        // Render a countdown
        return <Chip
            color={color}
            size={compact ? "small": "medium"}
            icon={<AccessTimeFilledIcon/>}
            label={text}/>
            ;

    };

    return <div className={styles.timer}>
        <Countdown
            date={dateEnd}
            renderer={timerRenderer}
        />
    </div>
};


export default CountdownTimer;