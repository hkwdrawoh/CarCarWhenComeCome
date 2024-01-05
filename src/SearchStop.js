import React, {useEffect, useState} from "react";
import kmb_stop_json from "./kmb_stop.json";
import special_route_json from "./special_route.json";
import {eventEmitter} from "./App";
import {FetchRouteStop, FetchStop} from "./fetch_api";
import ETADisplay from "./ETADisplay";
import {v4 as uuidv4} from 'uuid';

export default function SearchStop(props) {

    const [stop_ids, setStopIDs] = useState([]);
    const [stop_names, setStopNames] = useState([]);
    const [selected_id, setSelectedID] = useState(-1);
    const [jor_stop_ids, setJORStopIDs] = useState([]);
    const [jor_dir, setJORDir] = useState("");

    const reSelectDest = () => {
        eventEmitter.emit("resetDest");
    }

    useEffect( () => {
        fetchStopNames().then();
    }, []);

    const fetchStopNames = async () => {
        let ids = await FetchRouteStop(props.dir.route, props.bound, props.dir.service_type, "-1", props.company);
        // console.log(ids);
        if (props.style === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
            let jor_dir = (special_route_json.data.flip_bound.includes(props.dir.route)) ? ((props.bound === "O") ? "I" : "O") : props.bound;
            let jor_ids = await FetchRouteStop(props.dir.route, jor_dir, "1", "-1", (props.company === "kmb") ? "ctb" : "kmb");
            setJORStopIDs(jor_ids);
            setJORDir(jor_dir);
        } else {
            setJORStopIDs([]);
            setJORDir("");
        }
        let names;
        if (props.company === "kmb") {
            names = ids.map(id => {
                const matchedItem = kmb_stop_json.data.find(item => item.stop === id);
                return matchedItem ? matchedItem.name_tc : '';
            });
        } else if (props.company === "ctb") {
            const promises = ids.map(async id => FetchStop(id, "ctb"));
            const resolvedPromises = await Promise.all(promises);
            names = resolvedPromises.map(matchedItem => matchedItem ? matchedItem[0] : "錯誤");
        } else {
            names = ['錯誤'];
        }
        setStopIDs(ids);
        setStopNames(names);
    }

    const chooseStop = (id) => {
        setSelectedID(id);
    }

    const displayStopNum = (index) => {
        let output = Number(index) + 1;
        if (Number(output) < 10) {
            output = "0" + String(output)
        }
        return String(output);
    }

    let list_stop_div;
    if (selected_id !== -1) {
        let route = {
            direction: props.bound,
            service_type: props.dir.service_type,
            seq: Number(selected_id) + 1,
            company: props.company
        };
        let joint = null;
        if (props.style === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
            console.log(jor_stop_ids);
            joint = {
                route: props.dir.route,
                direction: jor_dir,
                service_type: "1",
                seq: Number(selected_id) + 1,
                stop_id: jor_stop_ids[selected_id],
                company: (props.company === "kmb") ? "ctb" : "kmb"
            }
        }
        list_stop_div = <>
            <h2>~ 到站時間 ~</h2>
            <div className="grid-5-fixed">
                <h2 className={`${props.style}_text`}>#{displayStopNum(selected_id)}</h2>
                <h2 className={`${props.style}_text text_left grid-span3`}>{stop_names[selected_id]}</h2>
                <div>
                    <button className='button_base button_hover button_icon' onClick={() => {chooseStop(selected_id - 1)}} disabled={selected_id === 0}>&lt;</button>
                    <button className='button_base button_hover button_thin' onClick={() => {chooseStop(-1)}}>返回</button>
                    <button className='button_base button_hover button_icon' onClick={() => {chooseStop(selected_id + 1)}} disabled={selected_id + 1 === stop_ids.length}>&gt;</button>
                </div>
            </div>
            <div className="grid-3-fixed">
                <ETADisplay key={uuidv4()} route={route} route_num={props.dir.route} stop_id={stop_ids[selected_id]} joint={joint}/>
            </div>
        </>
    } else if (JSON.stringify(stop_names) !== JSON.stringify([])) {
        list_stop_div = <>
            <div className="grid-10-fixed">
                {stop_names.map((stop_name, index) => <>
                    <button className='button_base button_hover grid-span2' onClick={() => {chooseStop(index)}}>選擇</button>
                    <h2 className={`${props.style}_text text_left`}>#{displayStopNum(index)}</h2>
                    <h2 className={`${props.style}_text text_left grid-span6`}>{stop_name}</h2>
                </>)}
            </div>
        </>
    } else {
        list_stop_div = (<h2>載入中...</h2>);
    }


    return <>
        <h2>選擇車站</h2>
        <div className="grid-5-fixed">
            <div className={`button_base ${props.style}_icon`}>{props.dir.route}</div>
            <div className={`${props.style}_text text_left grid-span3`}><h2>往：{props.dest}</h2></div>
            <button className='button_base button_hover' onClick={reSelectDest}>重選</button>
        </div>
        <hr />
        {list_stop_div}
    </>
}