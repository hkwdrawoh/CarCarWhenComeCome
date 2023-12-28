import React from 'react';
import HomeHeader from "./HomeHeader";
import Header from "./Header";
import RouteETAContainer from "./RouteETAContainer";
import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: 'main'
        }
    }

    componentDidMount() {
        eventEmitter.on('backToHome', () => {this.goToSite('main')})
    }

    goToSite = (site) => {
        this.setState({pages: site});
    }

    render() {
        let componentToRender;

        switch (this.state.pages) {
            case "OnTai":
                componentToRender = <>
                    <Header text="安泰邨 幾時有車？" />
                    <RouteETAContainer key="1" routeset='OnTai' />
                </>;
                break;
            case "HomeFrom108":
                componentToRender = <>
                    <Header text="108 幾時有車？" />
                    <RouteETAContainer key="1" routeset='HomeFrom108' />
                </>;
                break;
            case "LaiTakTsuen":
                componentToRender = <>
                    <Header text="勵德邨 幾時有車？" />
                    <RouteETAContainer key="1" routeset='LaiTakTsuen' />
                </>;
                break;
            case "Rhythm":
                componentToRender = <>
                    <Header text="采頤花園 幾時有車？" />
                    <RouteETAContainer key="1" routeset='Rhythm' />
                </>;
                break;
            default:
                componentToRender = <>
                    <HomeHeader />
                    <div className="content component">
                        <h2 className="section_title">~ 我喺呢度! ~</h2>
                        <div className="location">
                            <button onClick={() => {this.goToSite("OnTai")}} className="button_base location_button">安泰邨</button>
                            <button onClick={() => {this.goToSite("LaiTakTsuen")}} className="button_base location_button">勵德邨</button>
                            <button onClick={() => {this.goToSite("HomeFrom108")}} className="button_base location_button">108回家</button>
                            <button onClick={() => {this.goToSite("Rhythm")}} className="button_base location_button">采頤花園</button>
                        </div>
                        <hr/>
                        <h2 className="section_title">~ 我要揀車! ~</h2>
                        <div className="location">
                            <button className="button_base location_button">車車?</button>
                            <button className="button_base location_button">車車!</button>
                        </div>
                    </div>
                </>
        }
        return (componentToRender);
    }
}

export default App;