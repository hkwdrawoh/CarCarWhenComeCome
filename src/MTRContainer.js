import React, { useState } from 'react';
import "./mtr.css";
import Header from "./Header";
import {MTRLines, MTRStations} from "./MTRShapes";
import mtr_route_json from "./json/mtr_route.json";
import mtr_station_json from "./json/mtr_station.json";


export default function MTRContainer() {

    const mtr_routes = mtr_route_json.data.route;
    const mtr_stations = mtr_station_json.data.station;

    let [selectedRoute, setSelectedRoute] = useState('');
    let [selectedStation, setSelectedStation] = useState('');

    function selectRoute (route)  {
        setSelectedRoute((selectedRoute === route) ? '' : route);
    }

    function selectStation (station) {
        setSelectedStation(station);
    }

    let componentsToRender;
    if (selectedStation === '') {
        componentsToRender = <>
            {mtr_routes.map((route, index) => <>
                        <div className={(route.code !== selectedRoute) ? "list_button" : ""} onClick={() => selectRoute(route.code)}>
                            <MTRLines key={route.code} lineColor={route.code} lineName={route.name} from={route.from} to={route.to}/>
                        </div>
                        <div className="scroll_x scroll_bar-1" hidden={route.code !== selectedRoute}>
                            <div className="flex">
                                {mtr_stations[index].map((station) => (
                                    <div className="list_button" onClick={() => selectStation(station.code)}>
                                        <MTRStations key={route.code+station.code} lineColor={route.code} lines={station.lines} name={station.name} lineName={station.lineName} lineStyle={station.style} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
        </>
    } else {
        componentsToRender = <h2 onClick={() => selectStation("")} >{selectedRoute}: {selectedStation}</h2>
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
