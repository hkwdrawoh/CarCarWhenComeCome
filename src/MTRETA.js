import React, {useEffect, useState} from 'react';
import "./mtr.css";
import mtr_route_json from "./json/mtr_route.json";
import mtr_station_json from "./json/mtr_station.json";
import {eventEmitter} from "./App";
import {GetJSON} from "./fetchBusAPI";

export default function MTRETA (props) {

    const api_mtr = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php"
    const initState = {
        eta: [['', '', ''], ['', '更新中...', ''], ['', '', '']],
        animation: [[false, false, false], [false, false, false], [false, false, false]]
    }
    const [state, setState] = useState(initState);
    const [message, setMessage] = useState('載入中...');

    const CompareTime = (eta) => {
        const curr_time = new Date();
        const eta_time = new Date(eta);

        if (curr_time > eta_time && Math.abs(eta_time - curr_time) > 240000) {
            curr_time.setHours(curr_time.getHours() - 12);
            eta_time.setHours(eta_time.getHours() + 12);
        }
        let MinuteDiff = Math.floor(Math.abs(eta_time - curr_time + 20000) / (1000 * 60));
        if (curr_time > eta_time) {return 0}
        else if (MinuteDiff === 0) {return "<1"}
        else {return MinuteDiff}
    };

    useEffect(() => {
        eventEmitter.on('refreshETA', fetchETA);

        return (() => {
            eventEmitter.off('refreshETA', fetchETA);
        });
    }, [props, state]);

    useEffect(() => {
        if (props.stationCode[0] !== '') {
            fetchETA().then();
        }
    }, [props]);

    const fetchETA = async () => {
        if (props.stationCode[0] !== '') {
            const codes = props.routeCode[0] + "-" + props.stationCode[0];
            let api = api_mtr + "?line=" + props.routeCode[0] + "&sta=" + props.stationCode[0] + "&lang=tc";
            let json_data = await GetJSON(api);
            if (json_data.status === 0) {
                setMessage(json_data.message);
            } else if (json_data.data[codes].curr_time === "-") {
                setMessage("出現錯誤，請稍後再試。");
            } else {
                setMessage('');
            }
        }
    }

    let componentToRender;
    if (message === '') {
        componentToRender = <>
            <h2>HIIII</h2>
        </>;
    } else {
        componentToRender = <h2>{message}</h2>;
    }

    return (
        <div>
            <h2>{props.routeCode}</h2>
            <h2>{props.stationCode}</h2>
            {componentToRender}
        </div>
    )
}
