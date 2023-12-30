import React, { useState, useEffect } from 'react';
import {eventEmitter} from "./App";

export default function Header(props) {

    const [time_now, setTimeNow] = useState(new Date());
    const [time_ref, setTimeRef] = useState(new Date());
    const [animation, setAnimation] = useState(false);

    let intervalID1 = null;
    let intervalID2 = null;

    useEffect(() => {
        intervalID1 = setInterval(refreshTimeNow, 1000);
        intervalID2 = setInterval(refreshPage, 30000);

        return () => {
            clearInterval(intervalID1);
            clearInterval(intervalID2);
        }
    }, []);

    const refreshTimeNow = () => {
        setTimeNow(new Date())
    };

    const refreshPage = () => {
        setTimeRef(new Date())
        setAnimation(true);
        setTimeout(() => {
            setAnimation(false);
        }, 1000);
        eventEmitter.emit('refreshETA');
    };

    const backToHome = () => {
        eventEmitter.emit('backToHome');
    };

    const getTimeString = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return time.toLocaleTimeString(undefined, options);
    };

    return (
        <div className="component menu">
            <div className="menu">
                <div className="nav">
                    <h2>{props.text}</h2>
                    <button className="button_base back_index" onClick={backToHome}>主頁</button>
                </div>
                <div className="clock">
                    <div style={{verticalAlign: 'center'}}>
                        <h3>{getTimeString(time_now)}</h3>
                        <p>現在時間</p>
                    </div>
                    <div>
                        <h3 className={`flash-animation ${animation ? "show" : ""}`}>{getTimeString(time_ref)}</h3>
                        <p>更新時間</p>
                    </div>
                    <button className="RefreshButton" onClick={refreshPage}>更新</button>
                </div>
                <hr/>
            </div>
        </div>
    )

}

