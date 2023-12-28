import React from "react";
import { FetchETA } from "./fetch_api";
import {eventEmitter} from "./App";


class ETADisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eta: [['', '', ''], ['', '更新中...', ''], ['', '', '']],
            animation: [[false, false, false], [false, false, false], [false, false, false]]
        };
        this.animation = [[false, false, false], [false, false, false], [false, false, false]];
    }

    CompareTime(eta) {
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
    }

    componentDidMount() {
        eventEmitter.on('refreshETA', this.fetchETA);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props && this.props.stop_id !== null) {
            this.fetchETA().then().catch();
        }
    }

    componentWillUnmount() {
        eventEmitter.off('refreshETA', this.fetchETA);
    }

    fetchETA = async () => {
        if (this.props.stop_id !== null) {
            console.log('fetch!');
            let temp_eta = this.state.eta.slice();
            let temp_ani = this.state.animation.slice();
            let output = await FetchETA(this.props.route_num, this.props.route.direction, this.props.route.service_type, this.props.route.seq, this.props.stop_id, this.props.route.company).catch();
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
                    temp_ani[i][0] = (temp_eta[i][0] !== this.CompareTime(record.eta) + " min" || temp_ani[i][0]);
                    temp_eta[i][0] = this.CompareTime(record.eta) + " min";
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
            if (this.state.eta !== temp_eta) {
                this.setState({eta: temp_eta, animation: temp_ani});
                setTimeout(() => {
                    this.setState({animation: [[false, false, false], [false, false, false], [false, false, false]]});
                }, 500);
            }
        }
    }


    render() {
        return <>
            <div>
                <h2 className={`flash-animation ${this.state.animation[0][0] ? "show" : ""}`}>{this.state.eta[0][0] || `\u00A0`}</h2>
                <h3 className={`flash-animation ${this.state.animation[0][1] ? "show" : ""}`}>{this.state.eta[0][1] || `\u00A0`}</h3>
                <p className={`rmk flash-animation ${this.state.animation[0][2] ? "show" : ""}`}>{this.state.eta[0][2] || `\u00A0`}</p>
            </div>
            <div>
                <h2 className={`flash-animation ${this.state.animation[1][0] ? "show" : ""}`}>{this.state.eta[1][0] || `\u00A0`}</h2>
                <h3 className={`flash-animation ${this.state.animation[1][1] ? "show" : ""}`}>{this.state.eta[1][1] || `\u00A0`}</h3>
                <p className={`rmk flash-animation ${this.state.animation[1][2] ? "show" : ""}`}>{this.state.eta[1][2] || `\u00A0`}</p>
            </div>
            <div>
                <h2 className={`flash-animation ${this.state.animation[2][0] ? "show" : ""}`}>{this.state.eta[2][0] || `\u00A0`}</h2>
                <h3 className={`flash-animation ${this.state.animation[2][1] ? "show" : ""}`}>{this.state.eta[2][1] || `\u00A0`}</h3>
                <p className={`rmk flash-animation ${this.state.animation[2][2] ? "show" : ""}`}>{this.state.eta[2][2] || `\u00A0`}</p>
            </div>
        </>
    }

}

export default ETADisplay;