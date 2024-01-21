import { useState, useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import Header from "./Header";
import RouteETAContainer from "./RouteETAContainer";
import SearchContainer from "./SearchContainer";
import EventEmitter from 'eventemitter3';
import MTRContainer from "./MTRContainer";

export const eventEmitter = new EventEmitter();

export default function App() {

    const [pages, setPages] = useState('main');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const stateParam = searchParams.get('page');
        if (stateParam) {
            setPages(stateParam);
        }
    }, []);

    const goToSite = (site) => {
        setPages(site);
    };

    eventEmitter.on('backToHome', () => {goToSite('main')});

    switch (pages) {
        case "OnTai":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="安泰邨 幾時有車？" />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='OnTai' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "HomeFrom108":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="108 幾時有車？" />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='HomeFrom108' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "LaiTakTsuen":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="勵德邨 幾時有車？" />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='LaiTakTsuen' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "Rhythm":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="采頤花園 幾時有車？" />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='Rhythm' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "CWB":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="銅鑼灣 幾時有車？" />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='CWB' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "Search":
            return <>
                <SearchContainer />
            </>;
        case "MTR":
            return <>
                <MTRContainer />
            </>;
        default:
            return <>
                <div className="container">
                    <div className="container_top">
                        <HomeHeader />
                    </div>
                    <div className="container_mid">
                        <h2>~ 我喺呢度! ~</h2>
                        <div className="grid-9-minmax">
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("OnTai")}}>安泰邨</button>
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("Rhythm")}}>采頤花園</button>
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("LaiTakTsuen")}}>勵德邨</button>
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("CWB")}}>銅鑼灣</button>
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("HomeFrom108")}}>108回家</button>
                        </div>
                        <hr/>
                        <h2>~ 我要揀車! ~</h2>
                        <div className="grid-9-minmax">
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("Search")}}>巴士?</button>
                            <button className="button_base button_wide button_hover" onClick={() => {goToSite("MTR")}}>港鐵!</button>
                        </div>
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
    }

}
