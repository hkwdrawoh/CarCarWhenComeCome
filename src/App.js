import React, { useState } from 'react';
import HomeHeader from "./HomeHeader";
import Header from "./Header";
import RouteETAContainer from "./RouteETAContainer";
import SearchContainer from "./SearchContainer";
import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();

export default function App() {

    const [pages, setPages] = useState('main');

    const goToSite = (site) => {
        setPages(site);
    };

    eventEmitter.on('backToHome', () => {goToSite('main')});

    let componentToRender;
    switch (pages) {
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
        case "Search":
            componentToRender = <>
                <Header text="你搭邊架車車？" />
                <SearchContainer />
            </>;
            break;
        default:
            componentToRender = <>
                <HomeHeader />
                <div className="content component">
                    <h2 className="section_title">~ 我喺呢度! ~</h2>
                    <div className="location">
                        <button onClick={() => {goToSite("OnTai")}} className="button_base location_button">安泰邨</button>
                        <button onClick={() => {goToSite("LaiTakTsuen")}} className="button_base location_button">勵德邨</button>
                        <button onClick={() => {goToSite("HomeFrom108")}} className="button_base location_button">108回家</button>
                        <button onClick={() => {goToSite("Rhythm")}} className="button_base location_button">采頤花園</button>
                    </div>
                    <hr/>
                    <h2 className="section_title">~ 我要揀車! ~</h2>
                    <div className="location">
                        <button onClick={() => {goToSite("Search")}}  className="button_base location_button">車車?</button>
                        <button onClick={() => {goToSite("Search")}}  className="button_base location_button">車車!</button>
                    </div>
                </div>
            </>
    }
    return (componentToRender);

}
