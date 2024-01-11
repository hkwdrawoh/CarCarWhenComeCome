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
                        up.push([record.plat, record.dest, record.time.slice(-8, -3), compareTime(record.time)])
                    }
                    setUpTime(up);
                }
                if (json_data.data[codes].DOWN) {
                    let dn = [];
                    for (let record of json_data.data[codes].DOWN) {
                        dn.push([record.plat, record.dest, record.time.slice(-8, -3), compareTime(record.time)])
                    }
                    setDnTime(dn);
                }
            }
        }
    }

    let messageRender = null;
    let upRender = null;
    let dnRender = null;
    if (message !== '') {
        messageRender = <h2>{message}</h2>;
    } else {
        if (JSON.stringify(upTime) === JSON.stringify([])) {
            upRender = <>
                <hr />
                <div className="grid-5-fixed">
                    <h2 className="eta grid-span5">{mtr_routes.from.replace("\n", " / ")} 方向</h2>
                    <h2 className="eta grid-span5">暫無預定班次</h2>
                </div>
            </>;
        } else if (upTime !== null) {
            upRender = <>
                <hr />
                <div className="">
                    <h2 className="eta">{mtr_routes.from.replace("\n", " / ")} 方向</h2>
                    {upTime.map((record) => (
                        <div className="grid-6-fixed">
                            <div className="grid-3-fixed grid-span3">
                                <h2 className={`platform_num color_${props.routeCode[0]}`}>{record[0]}</h2>
                                <h2 className="grid-span2">往：{mtr_stations.find(sta => JSON.stringify(sta.code) === JSON.stringify(record[1])).name}</h2>
                            </div>
                            <div className="grid-3_5-minmax grid-span3">
                                <h2>{record[3]} min</h2>
                                <h3>({record[2]})</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </>;
        }
        if (JSON.stringify(dnTime) === JSON.stringify([])) {
            dnRender = <>
                <hr />
                <div className="grid-5-fixed">
                    <h2 className="eta grid-span5">{mtr_routes.to} 方向</h2>
                    <h2 className="eta grid-span5">暫無預定班次</h2>
                </div>
            </>;
        } else if (dnTime !== null) {
            dnRender = <>
                <hr />
                <div className="">
                    <h2 className="eta">{mtr_routes.to} 方向</h2>
                    {dnTime.map((record) => (
                        <div className="grid-6-fixed">
                            <div className="grid-3-fixed grid-span3">
                                <h2 className={`platform_num color_${props.routeCode[0]}`}>{record[0]}</h2>
                                <h2 className="grid-span2">往：{mtr_stations.find(sta => JSON.stringify(sta.code) === JSON.stringify(record[1])).name}</h2>
                            </div>
                            <div className="grid-3_5-minmax grid-span3">
                                <h2>{record[3]} min</h2>
                                <h3>({record[2]})</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </>;
        }
    }

    return (
        <div>
            {messageRender}
            {upRender}
            {dnRender}
        </div>
    )
}
