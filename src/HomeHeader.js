import React from 'react';
import {GetJSON} from "./fetch_api";

class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time_now: new Date(),
            weather: ''
        }
        this.intervalID1 = null;
    }

    componentDidMount() {
        this.intervalID1 = setInterval(this.refreshTimeNow, 1000);
        this.FetchWeather();
    }

    componentWillUnmount() {
        clearInterval(this.intervalID1);
    }

    refreshTimeNow = () => {
        this.setState({time_now: new Date()})
    }

    getTimeString = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return time.toLocaleTimeString(undefined, options);
    };

    FetchWeather = async () => {
        let api_url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc";
        let data = await GetJSON(api_url);
        let desc = data.tcInfo + "\n" + data.forecastDesc;
        this.setState({weather: desc})
    }

    render() {
        return <>
            <div className="menu component">
                <h1>我要搭車!</h1>
            </div>
            <div className="component">
                <div className="clock">
                    <div>
                        <h2>{this.getTimeString(this.state.time_now)}</h2>
                        <h3>現在時間</h3>
                    </div>
                    <div className="weather_div">
                        <h2 className="section_title">☀天氣就如預期☀</h2>
                        <p className="weather">{this.state.weather}</p>
                    </div>
                </div>
                <hr/>
            </div>
        </>
    }

}

export default HomeHeader;