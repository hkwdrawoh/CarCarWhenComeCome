import React, {useEffect, useState} from "react";
import RouteETA from "./RouteETA";
import * as routesData from "./routes";

export default function RouteETAContainer(props) {

    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        switch (props.routeset) {
            case "OnTai":
                setRoutes(routesData.OnTai);
                break;
            case "HomeFrom108":
                setRoutes(routesData.HomeFrom108);
                break;
            case "LaiTakTsuen":
                setRoutes(routesData.LaiTakTsuen);
                break;
            case "Rhythm":
                setRoutes(routesData.Rhythm);
                break;
            case "CWB":
                setRoutes(routesData.CWB);
                break;
            default:
                setRoutes(routesData.OnTai);
                break;
        }
    })

    return <>
        {routes.map((route) => (
                <RouteETA key={route.route + route.seq} route={route} />
            ))}
    </>

}
