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

    return <>
        <div className="page_title">
            <h2>{props.text}</h2>
            <p></p>
            <button className="button_base button_hover" style={{"marginRight": "1.55rem"}} onClick={backToHome}>主頁</button>
        </div>
        <div className="grid-3-fixed">
            <div>
                <h3>{getTimeString(time_now)}</h3>
                <p>現在時間</p>
            </div>
            <div>
                <h3 className={`flash-animation ${animation ? "show" : ""}`}>{getTimeString(time_ref)}</h3>
                <p>更新時間</p>
            </div>
            <button className="button_base button_hover" style={{"marginRight": "1.55rem"}} onClick={refreshPage}>更新</button>
        </div>
        <hr/>
    </>

}

