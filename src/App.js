import { useState, useEffect } from 'react';
import HomeHeader from "./HomeHeader";
import Header from "./Header";
import RouteETAContainer from "./RouteETAContainer";
import SearchContainer from "./SearchContainer";
import EventEmitter from 'eventemitter3';
import MTRContainer from "./MTRContainer";
import {Button, Grid, Text} from "@chakra-ui/react";

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

    switch (pages) {
        case "OnTai":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="安泰邨" goPage={setPages} />
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
                        <Header text="108 回家" goPage={setPages} />
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
                        <Header text="勵德邨" goPage={setPages} />
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
                        <Header text="采頤花園" goPage={setPages} />
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
                        <Header text="銅鑼灣" goPage={setPages} />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='CWB' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "SHT":
            return <>
                <div className="container">
                    <div className="container_top">
                        <Header text="沙田市中心" goPage={setPages} />
                    </div>
                    <div className="container_mid scroll_bar-1">
                        <RouteETAContainer key="1" routeset='SHT' />
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
        case "Search":
            return <>
                <SearchContainer goPage={setPages} />
            </>;
        case "MTR":
            return <>
                <MTRContainer goPage={setPages} />
            </>;
        default:
            return <>
                <div className="container">
                    <div className="container_top">
                        <HomeHeader />
                    </div>
                    <div className="container_mid">
                        <Text fontSize='xl' as='b'>~ 我喺呢度! ~</Text>
                        <Grid templateColumns="repeat(auto-fit , minmax(9em, 1fr))" gap={2}>
                            <Button onClick={() => {setPages("OnTai")}}>安泰邨</Button>
                            <Button onClick={() => {setPages("Rhythm")}}>采頤花園</Button>
                            <Button onClick={() => {setPages("LaiTakTsuen")}}>勵德邨</Button>
                            <Button onClick={() => {setPages("CWB")}}>銅鑼灣</Button>
                            <Button onClick={() => {setPages("HomeFrom108")}}>108 回家</Button>
                            <Button onClick={() => {setPages("SHT")}}>沙田市中心</Button>
                        </Grid>
                        <hr/>
                        <Text fontSize='xl' as='b'>~ 我要揀車! ~</Text>
                        <Grid templateColumns="repeat(auto-fit , minmax(9em, 1fr))" gap={2}>
                            <Button onClick={() => {setPages("Search")}}>巴士?</Button>
                            <Button onClick={() => {setPages("MTR")}}>港鐵!</Button>
                        </Grid>
                    </div>
                    <div className="container_bottom"></div>
                </div>
            </>;
    }

}
