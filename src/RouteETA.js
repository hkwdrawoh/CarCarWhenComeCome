import React, {useState, useEffect} from "react";
import ETADisplay from "./ETADisplay";
import { FetchRoute, FetchRouteStop, FetchStop } from "./fetch_api";

export default function RouteETA(props) {

    const [route_num, setRouteNum] = useState(props.route.route);
    const [station, setStation] = useState('---');
    const [terminal, setTerminal] = useState('---');
    const [stop_id, setStopID] = useState(null);
    const [classes, setClasses]  = useState(['KMB_route_num', 'KMB_route_info']);

    useEffect(() => {
        switch (props.route.style % 10) {
            case 1:
                setClasses(['KMB_route_num', 'KMB_route_info']);
                break;
            case 2:
                setClasses(['CTB_route_num', 'CTB_route_info']);
                break;
            case 3:
                setClasses(['GMB_route_num', 'GMB_route_info']);
                break;
            case 4:
                setClasses(['CTY_route_num', 'CTY_route_info']);
                break;
            case 5:
                setClasses(['LWB_route_num', 'LWB_route_info']);
                break;
            default:
                setClasses(['KMB_route_num', 'KMB_route_info']);
                break;
        }
        fetchNames().then();
    }, []);

    const fetchNames = async () => {
        try {
            let terminus = await FetchRoute(props.route.route, props.route.direction, props.route.service_type, props.route.company);
            if (Math.floor(props.route.style % 100 / 10) === 1) {
                setTerminal(terminus[1]);
            } else {
                setTerminal(terminus[0]);
            }
            if (props.route.company.substring(0, 3) === "gmb") {
                await setRouteNum(terminus[2]);
            }
            // console.log(state.route_num)
            let temp = (props.route.company.substring(0, 3) === "gmb") ? terminus[2] : props.route.route;
            let stop_id = await FetchRouteStop(temp, props.route.direction, props.route.service_type, props.route.seq, props.route.company).catch();
            let stop_name;
            if (props.route.company.substring(0, 3) === "gmb") {
                stop_name = [stop_id[1], stop_id[2]];
            } else {
                stop_name = await FetchStop(stop_id[0], props.route.company);
            }
            setStation(stop_name[0]);
            setStopID(stop_id[0]);
        } catch (error) {
        }
    }

    return <>
        <div className="eta">
            <div className={classes[0]}>
                <h1>{props.route.route}</h1>
            </div>
            <div className={classes[1]}>
                <h3>往：{terminal}</h3>
                <p>{station}</p>
            </div>
            <div className='time'>
                <ETADisplay route={props.route} route_num={route_num} stop_id={stop_id} joint={null}/>
            </div>
        </div>
        <hr />
        {Math.floor(props.route.style / 100) === 1 && <hr />}
    </>
}

