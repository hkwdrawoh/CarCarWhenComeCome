import React, { useState, useEffect } from "react";
import { FetchETA } from "./fetch_api";
import {eventEmitter} from "./App";


export default function ETADisplay(props) {

    const initState = {
        eta: [['', '', ''], ['', '更新中...', ''], ['', '', '']],
        animation: [[false, false, false], [false, false, false], [false, false, false]]
    }

    const [state, setState] = useState(initState);

    const CompareTime = (eta) => {
        const curr_time = new Date();
        const eta_time = new Date(eta);

        if (curr_time > eta_time && Math.abs(eta_time - curr_time) > 240000) {
            curr_time.setHours(curr_time.getHours() - 12);
            eta_time.setHours(eta_time.getHours() + 12);
        }
        let MinuteDiff = Math.floor(Math.abs(eta_time - curr_time + 20000) / (1000 * 60));
        // console.log(MinuteDiff);
        if (curr_time > eta_time) {return 0}
        else if (MinuteDiff === 0) {return "<1"}
        else {return MinuteDiff}
    };

    useEffect(() => {
        eventEmitter.on('refreshETA', fetchETA);

        return (() => {
            eventEmitter.off('refreshETA', fetchETA);
        });
    }, [props, state]);

    useEffect(() => {
        if (props.stop_id !== null) {
            fetchETA().then();
        }
    }, [props]);

    const fetchETA = async () => {
        // console.log('ETA!', props.stop_id);
        if (props.stop_id !== null) {
            console.log('fetch!');
            let temp_eta = state.eta.slice();
            let temp_ani = state.animation.slice();
            let output = await FetchETA(props.route_num, props.route.direction, props.route.service_type, props.route.seq, props.stop_id, props.route.company);
            // console.log(output);
            temp_eta[1][1] = (temp_eta[1][1] === '更新中...') ? '' : temp_eta[1][1];
            for (let i = 0; i < 3; i++) {
                let record = output[i];
                if (i === 0 && (record === undefined || record.eta === null)) {
                    temp_ani[0][1] = (temp_eta[0][1] !== '未來1個鐘都冇車' || temp_ani[0][1]);
                    temp_eta = [['', '未來1個鐘都冇車', ''], ['', '', ''], ['', '', '']];
                } else if (record === undefined) {
                    temp_eta[i] = ['', '', ''];
                } else if (record.eta === null) {
                    temp_ani[i][0] = (temp_eta[i][0] !== 'null' || temp_ani[i][0]);
                    temp_eta[i] = ['null', '', ''];
                } else {
                    temp_ani[i][0] = (temp_eta[i][0] !== CompareTime(record.eta) + " min" || temp_ani[i][0]);
                    temp_eta[i][0] = CompareTime(record.eta) + " min";
                    temp_ani[i][1] = (temp_eta[i][1] !== record.eta.slice(11, 19) || temp_ani[i][1]);
                    temp_eta[i][1] = record.eta.slice(11, 19);
                }
                if (record !== undefined && (record.rmk_tc !== "" && record.rmk_tc !== null)) {
                    temp_ani[i][2] = (temp_eta[i][2] !== record.rmk_tc || temp_ani[i][2]);
                    temp_eta[i][2] = record.rmk_tc;
                } else {
                    temp_eta[i][2] = '';
                }
            }
            // console.log(this.props.route_num, temp_ani)
            setState({eta: temp_eta, animation: temp_ani});
            setTimeout(() => {
                setState({...state, animation: initState.animation});
            }, 500);
        }
    }

    return <>
        <div>
            <h2 className={`flash-animation ${state.animation[0][0] ? "show" : ""}`}>{state.eta[0][0] || `\u00A0`}</h2>
            <h3 className={`flash-animation ${state.animation[0][1] ? "show" : ""}`}>{state.eta[0][1] || `\u00A0`}</h3>
            <p className={`rmk flash-animation ${state.animation[0][2] ? "show" : ""}`}>{state.eta[0][2] || `\u00A0`}</p>
        </div>
        <div>
            <h2 className={`flash-animation ${state.animation[1][0] ? "show" : ""}`}>{state.eta[1][0] || `\u00A0`}</h2>
            <h3 className={`flash-animation ${state.animation[1][1] ? "show" : ""}`}>{state.eta[1][1] || `\u00A0`}</h3>
            <p className={`rmk flash-animation ${state.animation[1][2] ? "show" : ""}`}>{state.eta[1][2] || `\u00A0`}</p>
        </div>
        <div>
            <h2 className={`flash-animation ${state.animation[2][0] ? "show" : ""}`}>{state.eta[2][0] || `\u00A0`}</h2>
            <h3 className={`flash-animation ${state.animation[2][1] ? "show" : ""}`}>{state.eta[2][1] || `\u00A0`}</h3>
            <p className={`rmk flash-animation ${state.animation[2][2] ? "show" : ""}`}>{state.eta[2][2] || `\u00A0`}</p>
        </div>
    </>

}
