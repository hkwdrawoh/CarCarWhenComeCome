import React, { useState, useEffect } from 'react';
import {GetJSON} from "./fetch_api";

export default function HomeHeader() {

    const [time_now, setTimeNow] = useState(new Date());
    const [weather, setWeather] = useState('');

    let intervalID1 = null;

    useEffect(() => {
        intervalID1 = setInterval(refreshTimeNow, 1000);
        FetchWeather().then();

        return (() => {
            clearInterval(intervalID1);
        })
    }, []);

    const refreshTimeNow = () => {
        setTimeNow(new Date());
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

    const FetchWeather = async () => {
        let api_url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc";
        let data = await GetJSON(api_url);
        let desc = data.tcInfo + "\n" + data.forecastDesc;
        setWeather(desc);
    };

    return <>
        <div className="menu component">
            <h1>我要搭車!</h1>
        </div>
        <div className="component">
            <div className="clock">
                <div>
                    <h2>{getTimeString(time_now)}</h2>
                    <h3>現在時間</h3>
                </div>
                <div className="weather_div">
                    <h2 className="section_title">☀天氣就如預期☀</h2>
                    <p className="weather">{weather}</p>
                </div>
            </div>
            <hr/>
        </div>
    </>

}
