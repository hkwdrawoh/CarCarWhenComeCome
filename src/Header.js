import React from 'react';
import {eventEmitter} from "./App";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time_now: new Date(),
            time_ref: new Date(),
            animation: false
        }
        this.intervalID1 = null;
        this.intervalID2 = null;
    }

    componentDidMount() {
        this.intervalID1 = setInterval(this.refreshTimeNow, 1000);
        this.intervalID2 = setInterval(this.refreshPage, 40000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID1);
        clearInterval(this.intervalID2);
    }

    refreshTimeNow = () => {
        this.setState({time_now: new Date()})
    }

    refreshPage = () => {
        this.setState({time_ref: new Date()})
        this.setState({ animation: true }, () => {
            setTimeout(() => {
                this.setState({animation: false});
            }, 500)
        });
        eventEmitter.emit('refreshETA');
    }

    backToHome = () => {
        eventEmitter.emit('backToHome');
    }

    getTimeString = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return time.toLocaleTimeString(undefined, options);
    };

    render() {
        return (
            <div className="component menu">
                <div className="menu">
                    <div className="nav">
                        <h2>{this.props.text}</h2>
                        <button className="button_base back_index" onClick={this.backToHome}>主頁</button>
                    </div>
                    <div className="clock">
                        <div style={{verticalAlign: 'center'}}>
                            <h3>{this.getTimeString(this.state.time_now)}</h3>
                            <p>現在時間</p>
                        </div>
                        <div>
                            <h3 className={`flash-animation ${this.state.animation ? "show" : ""}`}>{this.getTimeString(this.state.time_ref)}</h3>
                            <p>更新時間</p>
                        </div>
                        <button className="RefreshButton" onClick={this.refreshPage}>更新</button>
                    </div>
                    <hr/>
                </div>
            </div>
        )
    }
}

export default Header;
