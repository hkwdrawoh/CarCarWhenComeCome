import React, { useEffect, useState } from 'react';
import "./mtr.css";
import mtr_route_json from "./json/mtr_route.json";
import mtr_station_json from "./json/mtr_station.json";
import {eventEmitter} from "./App";
import { GetJSON, compareTime } from "./fetchBusAPI";

export default function MTRETA (props) {

    const mtr_routes = mtr_route_json.data.route[props.routeCode[1]];
    const mtr_stations = mtr_station_json.data.station[props.routeCode[1]];

    const api_mtr = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php"
    const [message, setMessage] = useState('載入中...');
    const [upTime, setUpTime] = useState(null);
    const [dnTime, setDnTime] = useState(null);

    useEffect(() => {
        eventEmitter.on('refreshETA', fetchETA);
        return (() => {
            eventEmitter.off('refreshETA', fetchETA);
        });
    }, [props, upTime, dnTime]);

    useEffect(() => {
        setMessage('載入中...');
        setUpTime(null);
        setDnTime(null);
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
                if (json_data.data[codes].UP) {
                    let up = [];
                    for (let record of json_data.data[codes].UP) {
                        up.push([record.plat, record.dest, record.time.slice(-8, -3), compareTime(record.time), record.route])
                    }
                    setUpTime(up);
                }
                if (json_data.data[codes].DOWN) {
                    let dn = [];
                    for (let record of json_data.data[codes].DOWN) {
                        dn.push([record.plat, record.dest, record.time.slice(-8, -3), compareTime(record.time), record.route])
                    }
                    setDnTime(dn);
                }
            }
        }
    }

    const etaRender = (records, dir) => {
        if (JSON.stringify(records) === JSON.stringify([])) {
            return <>
                <hr />
                <div className="grid-5-fixed">
                    <h2>{(dir === "UP") ? "←" : ""}</h2>
                    <h2 className="eta grid-span3">{((dir === "UP") ? mtr_routes.from : mtr_routes.to).replace("\n", " / ")} 方向</h2>
                    <h2>{(dir === "DN") ? "→" : ""}</h2>
                </div>
                <h2 className="eta">暫無預定班次</h2>
            </>;
        }
        if (records !== null) {
            return <>
                <hr />
                <div className="grid-5-fixed">
                    <h2>{(dir === "UP") ? "←" : ""}</h2>
                    <h2 className="eta grid-span3">{((dir === "UP") ? mtr_routes.from : mtr_routes.to).replace("\n", " / ")} 方向</h2>
                    <h2>{(dir === "DN") ? "→" : ""}</h2>
                </div>
                {records.map((record) => (
                    <div className="grid-5-fixed">
                        <h2 className={`platform_num color_${props.routeCode[0]}`}>{record[0]}</h2>
                        <div className="grid-span2 text_left">
                            <h2>往: {mtr_stations.find(sta => JSON.stringify(sta.code) === JSON.stringify(record[1])).name}</h2>
                            <p>{(record[4] === "RAC") ? `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0途經馬場` : ""}</p>
                        </div>
                        <div className="grid-4_4-minmax grid-span2">
                            <h2>{record[3]} min</h2>
                            <h3>({record[2]})</h3>
                        </div>
                    </div>
                ))}
            </>;
        }
        return null;
    }

    let messageRender = null;
    let upRender = null;
    let dnRender = null;
    if (message !== '') {
        messageRender = <h2>{message}</h2>;
    } else {
        upRender = etaRender(upTime, "UP");
        dnRender = etaRender(dnTime, "DN");
    }

    return (
        <div>
            {messageRender}
            {upRender}
            {dnRender}
        </div>
    )
}
