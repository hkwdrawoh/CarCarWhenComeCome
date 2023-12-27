import React from "react";
import { FetchETA } from "./fetch_api";

class ETADisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eta: [['', '', ''], ['', '更新中...', ''], ['', '', '']]
        }
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

    componentDidUpdate() {
        this.fetchETA();
    }

    fetchETA = async () => {
        if (this.props.stop_id !== null) {
            let temp = this.state.eta.slice();
            let output = await FetchETA(this.props.route_num, this.props.route.direction, this.props.route.service_type, this.props.route.seq, this.props.stop_id, this.props.route.company)
            // console.log(output);
            for (let i = 0; i < 3; i++) {
                let record = output[i];
                if (i === 0 && (record === undefined || record.eta === null)) {
                    temp[1][1] = '未來60分鐘一架車都冇';
                } else if (record === undefined && temp[1][1] !== '未來60分鐘一架車都冇') {
                    temp[i][1] = '';
                } else if (record === undefined) {
                } else if (record.eta === null) {
                    temp[i][0] = 'null';
                } else {
                    temp[i][0] = this.CompareTime(record.eta) + " min";
                    temp[i][1] = record.eta.slice(11, 19);
                }
                if (record !== undefined && (record.rmk_tc !== "" && record.rmk_tc !== null)) {
                    temp[i][2] = record.rmk_tc;
                }
            }
            if (this.state.eta != temp) {
                this.setState({eta: temp});
            }
        }
    }


    render() {
        return <>
            <div>
                <h2>&emsp;{this.state.eta[0][0]}&emsp;</h2>
                <h3>&emsp;{this.state.eta[0][1]}&emsp;</h3>
                <p className='rmk'>&emsp;{this.state.eta[0][2]}&emsp;</p>
            </div>
            <div>
                <h2>&emsp;{this.state.eta[1][0]}&emsp;</h2>
                <h3>&emsp;{this.state.eta[1][1]}&emsp;</h3>
                <p className='rmk'>&emsp;{this.state.eta[1][2]}&emsp;</p>
            </div>
            <div>
                <h2>&emsp;{this.state.eta[2][0]}&emsp;</h2>
                <h3>&emsp;{this.state.eta[2][1]}&emsp;</h3>
                <p className='rmk'>&emsp;{this.state.eta[2][2]}&emsp;</p>
            </div>
        </>
    }

}

export default ETADisplay;