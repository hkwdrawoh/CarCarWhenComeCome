import React from "react";
import ETADisplay from "./ETADisplay";
import { FetchRoute, FetchRouteStop, FetchStop } from "./fetch_api";

class RouteETA extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            route_num: props.route.route,
            station: '---',
            terminal: '---',
            stop_id: null,
            classes: ['KMB_route_num', 'KMB_route_info']
        }
    }

    componentDidMount() {
        switch (this.props.route.style % 10) {
            case 1:
                this.setState({classes: ['KMB_route_num', 'KMB_route_info']});
                break;
            case 2:
                this.setState({classes: ['CTB_route_num', 'CTB_route_info']});
                break;
            case 3:
                this.setState({classes: ['GMB_route_num', 'GMB_route_info']});
                break;
            case 4:
                this.setState({classes: ['CTY_route_num', 'CTY_route_info']});
                break;
            case 5:
                this.setState({classes: ['LWB_route_num', 'LWB_route_info']});
                break;
            default:
                this.setState({classes: ['KMB_route_num', 'KMB_route_info']});
                break;
        }
        this.fetchNames();
    }

    fetchNames = async () => {
        try {
            let terminus = await FetchRoute(this.props.route.route, this.props.route.direction, this.props.route.service_type, this.props.route.company);
            if (Math.floor(this.props.route.style / 10) === 1) {
                this.setState({terminal: terminus[1]})
            } else {
                this.setState({terminal: terminus[0]})
            }
            if (this.props.route.company.substring(0, 3) === "gmb") {
                await this.setState({route_num: terminus[2]})
            }
            // console.log(this.state.route_num)
            let stop_id = await FetchRouteStop(this.state.route_num, this.props.route.direction, this.props.route.service_type, this.props.route.seq, this.props.route.company);
            let stop_name;
            if (this.props.route.company.substring(0, 3) === "gmb") {
                stop_name = [stop_id[1], stop_id[2]];
            } else {
                stop_name = await FetchStop(stop_id[0], this.props.route.company);
            }
            this.setState({station: stop_name[0], stop_id: stop_id[0]});
        } catch (error) {
        }
    }

    render() {
        return <>
            <div className="eta">
                <div className={this.state.classes[0]}>
                    <h1>{this.props.route.route}</h1>
                </div>
                <div className={this.state.classes[1]}>
                    <h3>{this.state.station}</h3>
                    <p>往：{this.state.terminal}</p>
                </div>
                <div className='time'>
                    <ETADisplay route={this.props.route} route_num={this.state.route_num} stop_id={this.state.stop_id} />
                </div>
            </div>
            <hr />
        </>
    }
}

export default RouteETA;
