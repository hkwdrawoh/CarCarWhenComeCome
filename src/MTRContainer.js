import React, { useState, useEffect, useRef } from 'react';
import "./mtr.css";
import Header from "./Header";
import {MTRLines, MTRStations} from "./MTRShapes";
import mtr_route_json from "./json/mtr_route.json";
import mtr_station_json from "./json/mtr_station.json";
import MTRETA from "./MTRETA";


export default function MTRContainer() {

    const mtr_routes = mtr_route_json.data.route;
    const mtr_stations = mtr_station_json.data.station;

    let [selectedRoute, setSelectedRoute] = useState(['', -1]);
    let [selectedStation, setSelectedStation] = useState(['', -1]);

    const scrollToRef = useRef(null);

    useEffect(() => {
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }
    }, [selectedStation]);

    function selectRoute (route, index)  {
        setSelectedRoute((selectedRoute[0] === route) ? ['', -1] : [route, index]);
    }

    function selectStation (station, index) {
        if (station !== selectedStation[0]) {
            setSelectedStation([station, index]);
        }
    }

    let componentsToRender;
    if (selectedStation[1] === -1) {
        componentsToRender = <>
            {mtr_routes.map((route, index) => <>
                <div className={(route.code !== selectedRoute[0]) ? "list_button" : ""} onClick={() => selectRoute(route.code, index)}>
                    <MTRLines key={route.code} lineColor={route.code} lineName={route.name} from={route.from} to={route.to}/>
                </div>
                <div className="scroll_x scroll_bar-1" hidden={route.code !== selectedRoute[0]}>
                    <div className="grid-6-minmax grid-column">
                        {mtr_stations[index].map((station) => (
                            <div onClick={() => selectStation(station.code, station.seq)}>
                                <MTRStations key={route.code+station.code} lineColor={route.code} lines={station.lines} name={station.name} lineName={station.lineName} lineStyle={station.style} />
                            </div>))}
                    </div>
                </div>
            </>)}
        </>
    } else {
        componentsToRender = <>
            <div className="grid-3-fixed">
                <h2 className={`button_base color_${selectedRoute[0]}`}>{mtr_routes[selectedRoute[1]].name}</h2>
                <h1>{mtr_stations[selectedRoute[1]][selectedStation[1] - 1].name}</h1>
                <button className='button_base button_hover' onClick={() => setSelectedStation(['', -1])}>返回</button>
            </div>

            <div className="scroll_x scroll_bar-1">
                <div className="grid-6-minmax grid-column">
                    {mtr_stations[selectedRoute[1]].map((station) => (
                        <div ref={(station.seq !== Math.max(selectedStation[1]-1, 0) ) ? null : scrollToRef} onClick={() => selectStation(station.code, station.seq)}>
                            <MTRStations key={selectedRoute[0].code+station.code} lineColor={selectedRoute[0]} lines={station.lines} name={station.name} lineName={station.lineName} lineStyle={station.style} selected={station.seq === selectedStation[1]}/>
                        </div>
                    ))}
                </div>
            </div>
            <MTRETA routeCode={selectedRoute} stationCode={selectedStation} />
        </>;
    }

    return (
        <div className="container">
            <div className="container_top">
                <Header text="你喺邊個地鐵站？" />
            </div>
            <div className="container_mid scroll_bar-1">
                {componentsToRender}
            </div>
            <div className="container_bottom"></div>
        </div>
    )
}
