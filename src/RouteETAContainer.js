import React from "react";
import RouteETA from "./RouteETA";
import * as routesData from "./routes";

class RouteETAContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            routes: []
        }
    }

    componentDidMount() {
        if (this.props.routeset === "OnTai") {
            this.setState({
                routes: routesData.OnTaiTerm,
            })
        }
    }

    render() {
        return (
            <div className='component'>
                {this.state.routes.map((route) => (
                    <RouteETA key={route.route} route={route} />
                ))}
            </div>
        )
    }

}

export default RouteETAContainer;