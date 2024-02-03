import React, {useEffect, useRef, useState} from "react";
import kmb_stop_json from "./json/kmb_stop.json";
import special_route_json from "./json/special_route.json";
import {FetchRouteStop, FetchStop} from "./fetchBusAPI";
import ETADisplay from "./ETADisplay";
import {v4 as uuidv4} from 'uuid';
import bus_fares_json from "./json/bus_fare.json";
import {LoaderComponent} from "./SmallComponents";
import {Center} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";

export default function SearchStop(props) {

    const [stop_ids, setStopIDs] = useState([]);
    const [stop_names, setStopNames] = useState([]);
    const [selected_id, setSelectedID] = useState(-1);
    const [jor_stop_ids, setJORStopIDs] = useState([]);
    const [jor_dir, setJORDir] = useState("");
    const [fares, setFares] = useState([]);

    const scrollToRef = useRef(null);
    const bus_fares = bus_fares_json.data.bus_fares;

    useEffect( () => {
        fetchStopNames().then();
    }, []);

    useEffect(() => {
        if (scrollToRef.current) {
            // scrollToRef.current.scrollBy(0, 2000);
        }
    }, [selected_id]);

    const fetchStopNames = async () => {
        let ids = await FetchRouteStop(props.dir.route, props.bound, props.dir.service_type, "-1", props.company);
        if (props.style === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
            let jor_dir = (special_route_json.data.flip_bound.includes(props.dir.route)) ? ((props.bound === "O") ? "I" : "O") : props.bound;
            let jor_ids = await FetchRouteStop(props.dir.route, jor_dir, "1", "-1", (props.company === "kmb") ? "ctb" : "kmb");
            setJORStopIDs(jor_ids);
            setJORDir(jor_dir);
        } else {
            setJORStopIDs([]);
            setJORDir("");
        }
        let names = [];
        if (props.company === "kmb") {
            names = ids.map(id => {
                const matchedItem = kmb_stop_json.data.find(item => item.stop === id);
                return matchedItem ? matchedItem.name_tc : '';
            });
        } else if (props.company === "ctb") {
            const promises = ids.map(async id => FetchStop(id, "ctb"));
            const resolvedPromises = await Promise.all(promises);
            names = resolvedPromises.map(matchedItem => matchedItem ? matchedItem[0] : "錯誤");
        }
        let section_fares = bus_fares.filter((a) => a.route_id === props.route_id && a.route_seq === (props.bound === "O" ? 1 : 2)).sort((a, b) => a.starting_seq > b.starting_seq);
        let fares = Array(names.length);
        fares.fill(0);
        for (let i = 0; i < section_fares.length; i++) {
            fares.fill(section_fares[i].price, section_fares[i].starting_seq - 1)
        }
        setStopIDs(ids);
        setStopNames(names);
        setFares(fares);
    };

    const chooseStop = (id) => {
        setSelectedID((selected_id === id) ? -1 : id);
    };

    const displayStopNum = (index) => {
        let output = Number(index) + 1;
        if (Number(output) < 10) {
            output = "0" + String(output)
        }
        return String(output);
    };

    const route = {
        direction: props.bound,
        service_type: props.dir.service_type,
        seq: Number(selected_id) + 1,
        company: props.company
    };

    let joint = null;
    if (props.style === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
        joint = {
            route: props.dir.route,
            direction: jor_dir,
            service_type: "1",
            seq: Number(selected_id) + 1,
            stop_id: jor_stop_ids[selected_id],
            company: (props.company === "kmb") ? "ctb" : "kmb"
        }
    }

    const ShowStopETA = (id) => {
        if (selected_id === id.id) {
            return <>
                <div className="grid-3-fixed">
                    <ETADisplay key={uuidv4()} route={route} route_num={props.dir.route} stop_id={stop_ids[selected_id]} joint={joint}/>
                </div>
            </>
        }
        return <></>
    }

    if (JSON.stringify(stop_names) !== JSON.stringify([])) {
        return <>
            {stop_names.map((stop_name, index) => <>
                <div ref={(selected_id === index) ? null : scrollToRef} className={(selected_id === index) ? "grid-6-fixed " : "list_button grid-6-fixed"} onClick={() => {chooseStop(index)}}>
                    <h2 className={`${props.style}_text`}>#{displayStopNum(index)}</h2>
                    <div className={`${props.style}_text text_left grid-span4`}>
                        <h2>{stop_name}</h2>
                        <p>{(fares[index] !== 0 && props.company === "kmb" && props.dir.service_type === "1") ? `車費：$${fares[index].toFixed(1)}` : ""}</p>
                    </div>
                    {(selected_id === index) ? <Center><ChevronUpIcon boxSize={7} /></Center> : <Center><ChevronDownIcon boxSize={7} /></Center>}
                </div>
                <ShowStopETA id={index} />
            </>)}
        </>
    } else {
        return <>
            <LoaderComponent />
        </>;
    }

}