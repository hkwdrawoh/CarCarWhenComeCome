import React from "react";
import RouteETA from "./RouteETA";
import * as routesData from "./routes";
import {LaiTakTsuen} from "./routes";

class RouteETAContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            routes: []
        }
    }

    componentDidMount() {
        switch (this.props.routeset) {
            case "OnTai":
                this.setState({routes: routesData.OnTai});
                break;
            case "HomeFrom108":
                this.setState({routes: routesData.HomeFrom108});
                break;
            case "LaiTakTsuen":
                this.setState({routes: routesData.LaiTakTsuen});
                break;
            case "Rhythm":
                this.setState({routes: routesData.Rhythm});
                break;
            default:
                this.setState({routes: routesData.OnTai});
                break;
        }
    }

    render() {
        return (
            <div className='component'>
                {this.state.routes.map((route) => (
                    <RouteETA key={route.route + route.seq} route={route} />
                ))}
            </div>
        )
    }

}

export default RouteETAContainer;