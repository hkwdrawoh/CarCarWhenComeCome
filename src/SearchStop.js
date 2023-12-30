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
        if (props.style[0] === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
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

    let list_stop_div;
    if (selected_id !== -1) {
        let route = {
            direction: props.bound,
            service_type: props.dir.service_type,
            seq: Number(selected_id) + 1,
            company: props.company
        };
        let joint = null;
        if (props.style[0] === 'jor' && (props.dir.service_type === "1" || props.company === "ctb")) {
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
            <div id="show_eta">
                <h2 className="section_title">~ 到站時間 ~</h2>
                <div id="chosen_stop">
                    <h2 className={`stop_num_${props.style[0]}`}>#{Number(selected_id) + 1}</h2>
                    <h2 className={`${props.style[1]}_route_info`}>{stop_names[selected_id]}</h2>
                    <div className="num_pad">
                        <button className='button_base' onClick={() => {chooseStop(selected_id - 1)}} disabled={selected_id === 0}>&lt;</button>
                        <button className='button_base' onClick={() => {chooseStop(-1)}}>返回</button>
                        <button className='button_base' onClick={() => {chooseStop(selected_id + 1)}} disabled={selected_id + 2 === stop_ids.length}>&gt;</button>
                    </div>
                </div>
                <div className="time">
                    <ETADisplay key={uuidv4()} route={route} route_num={props.dir.route} stop_id={stop_ids[selected_id]} joint={joint}/>
                </div>
            </div>
        </>
    } else if (JSON.stringify(stop_names) !== JSON.stringify([])) {
        list_stop_div = <>
            <div className="list_stop">
                {stop_names.map((stop_name, index) => <>
                    <h2 className={`stop_num_${props.style[0]}`}>#{Number(index) + 1}</h2>
                    <h2 className={`${props.style[1]}_route_info`}>{stop_name}</h2>
                    <button className='button_base' onClick={() => {chooseStop(index)}}>選擇</button>
                </>)}
            </div>
        </>
    } else {
        list_stop_div = <>
            <div className="section_title">
                    <h2>載入中...</h2>
            </div>
        </>
    }


    return <>
        <div className="component">
            <h2 className="section_title">選擇車站</h2>
            <div className="list_dir">
                <div className="show_dir">
                    <div className={`button_base search_${props.style[0]}`}>{props.dir.route}</div>
                    <div className={`${props.style[1]}_route_info`}><h2>住：{props.dest}</h2></div>
                </div>
                <button className='button_base' onClick={reSelectDest}>返回</button>
            </div>
            <hr />
            {list_stop_div}
        </div>
    </>
}