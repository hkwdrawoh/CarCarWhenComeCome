import React, { useState, useEffect } from 'react';
import kmb_route_json from "./kmb_route.json"
import ctb_route_json from "./ctb_route.json"
import special_route_json from "./special_route.json"
import {eventEmitter} from "./App";


export default function SearchContainer() {

    const kmb_routes = kmb_route_json.data;
    const ctb_routes = ctb_route_json.data;
    const joint_routes = special_route_json.data.joint_routes;
    const ctb_circular_routes = special_route_json.data.ctb_circular_routes;
    const kmb_route_list = [...new Set(kmb_routes.map(item => item.route))];
    const ctb_route_list = [...new Set(ctb_routes.map(item => item.route))];


    const [routes_list, setRoutesList] = useState([]);
    const [company, setCompany] = useState('');
    const [route_num, setRouteNum] = useState('');
    const [avail_letter, setAvailLetter] = useState([]);
    const [direction, setDirection] = useState([]);
    const [direction_special, setDirectionSpecial] = useState([]);
    const [selected_dest, setSelectedDest] = useState([]);

    useEffect(() => {
        updateAvail("").then();
    }, [routes_list]);

    useEffect(() => {
        eventEmitter.on('resetDest', resetSelectedDest);

        return (() => {
            eventEmitter.off('resetDest', resetSelectedDest);
        });
    }, [selected_dest]);

    const resetSelectedDest = () => {
        setSelectedDest([]);
    }

    const chooseCompany = (selected_company) => {
        let selected_routes_list = [];
        if (selected_company === "kmb") {
            selected_routes_list = kmb_route_list;
            updateAvail("").then();
            setCompany("kmb");
        } else if (selected_company === "ctb") {
            selected_routes_list = ctb_route_list;
            updateAvail("").then();
            setCompany("ctb");
        } else {
            selected_routes_list = [];
            updateAvail("").then();
            setCompany("");
        }
        setRoutesList(() => selected_routes_list);
    };

    const chooseRoute = (selected_letter) => {
        let newRouteNum = route_num;
        switch (selected_letter) {
            case "cancel":
                newRouteNum = "";
                break;
            case "back":
                if (route_num.length > 0) {newRouteNum = route_num.slice(0, -1)}
                break;
            default:
                newRouteNum = route_num + String(selected_letter);
        }
        updateAvail(newRouteNum).then();
    }

    const updateAvail = async (newRouteNum) => {
        let newAvailRoutes = routes_list.filter(item => item.startsWith(newRouteNum));
        let newAvailLetter = [...new Set(newAvailRoutes.map(item => item.charAt(newRouteNum.length)))].sort().filter(item => item !== '');
        setRouteNum(newRouteNum);
        setAvailLetter(newAvailLetter);
        setDirection([]);
        setDirectionSpecial([]);
        if (newAvailRoutes.includes(newRouteNum) && newRouteNum !== "") {
            if (company === "kmb") {
                let dir = kmb_routes.filter(item => item.route === newRouteNum).sort((a, b) => a.service_type - b.service_type);
                setDirection(dir.filter(item => item.service_type === "1").map(item => item.dest_tc));
                setDirectionSpecial(dir.filter(item => item.service_type !== "1").map(item => item.dest_tc))
            } else if (company === "ctb") {
                let dir = ctb_routes.filter(item => item.route === newRouteNum);
                setDirection([dir[0].dest_tc]);
                if (!ctb_circular_routes.includes(newRouteNum)) {
                    setDirectionSpecial([dir[0].orig_tc]);
                }
            }
        }
    }

    let letters_div;
    if (avail_letter.filter(item => /^[A-Za-z]$/.test(item)).length === 0) {
        letters_div = <h1 style={{"padding": "0.4rem 0"}}>&emsp;</h1>
    } else {
        letters_div = avail_letter.filter(item => /^[A-Za-z]$/.test(item)).map((letter) => (
            <button onClick={() => {chooseRoute(letter)}}  className='letters' disabled={!avail_letter.includes(letter)}>{letter}</button>
        ))
    }

    let letter_pad_div;
    if (company !== "") {
        letter_pad_div = (
            <div className="component">
                <h2 className="section_title">選擇路線號碼</h2>
                <div className="button_base route_fill"><p>{route_num || `\u00A0`}</p></div>
                <div id="letter_pad">
                    {letters_div}
                </div>
                <div className="num_pad">
                    <button onClick={() => {chooseRoute("1")}}  className='numbers' disabled={!avail_letter.includes("1")}>1</button>
                    <button onClick={() => {chooseRoute("2")}}  className='numbers' disabled={!avail_letter.includes("2")}>2</button>
                    <button onClick={() => {chooseRoute("3")}}  className='numbers' disabled={!avail_letter.includes("3")}>3</button>
                    <button onClick={() => {chooseRoute("4")}}  className='numbers' disabled={!avail_letter.includes("4")}>4</button>
                    <button onClick={() => {chooseRoute("5")}}  className='numbers' disabled={!avail_letter.includes("5")}>5</button>
                    <button onClick={() => {chooseRoute("6")}}  className='numbers' disabled={!avail_letter.includes("6")}>6</button>
                    <button onClick={() => {chooseRoute("7")}}  className='numbers' disabled={!avail_letter.includes("7")}>7</button>
                    <button onClick={() => {chooseRoute("8")}}  className='numbers' disabled={!avail_letter.includes("8")}>8</button>
                    <button onClick={() => {chooseRoute("9")}}  className='numbers' disabled={!avail_letter.includes("9")}>9</button>
                    <button onClick={() => {chooseRoute("cancel")}}  className='numbers'>取消</button>
                    <button onClick={() => {chooseRoute("0")}}  className='numbers' disabled={!avail_letter.includes("0")}>0</button>
                    <button onClick={() => {chooseRoute("back")}}  className='numbers'>返回</button>
                </div>
                <hr/>
            </div>
        )
    } else {
        letter_pad_div = null;
    }

    let select_dir_div;
    let dir_div = null;
    let dir_special_div = null;
    if (direction.length !== 0) {
        let name;
        if (company === "kmb") {
            if (route_num.at(0) === "A" || route_num.at(0) === "E" || route_num.at(0) === "S" || route_num.slice(0, 2) === "NA") {
                name = ['lwb', 'LWB'];
            } else if (joint_routes.includes(route_num)) {
                name = ['jor', 'JOR'];
            } else {
                name = ['kmb', 'KMB'];
            }
            dir_div = direction.map((dir) => (<>
                <div className={`button_base search_${name[0]}`}>{route_num}</div>
                <div className={`${name[1]}_route_info`}><h2>往：{dir}</h2></div>
                <button className='button_base'>選擇</button>
            </>));
            dir_special_div = direction_special.map((dir) => (<>
                <div className={`button_base search_${name[0]}`}>{route_num}</div>
                <div className={`${name[1]}_route_info`}><h2>往：{dir}</h2><h3>(特別班次)</h3></div>
                <button className='button_base'>選擇</button>
            </>))
        } else if (company === "ctb") {
            if (route_num.at(0) === "A" || route_num.slice(0, 2) === "NA") {
                name = ['cty', 'CTY'];
            } else if (joint_routes.includes(route_num)) {
                name = ['jor', 'JOR'];
            } else {
                name = ['ctb', 'CTB'];
            }
            dir_div = direction.map((dir) => (<>
                <div className={`button_base search_${name[0]}`}>{route_num}</div>
                <div className={`${name[1]}_route_info`}><h2>往：{dir}</h2></div>
                <button className='button_base'>選擇</button>
            </>));
            dir_special_div = direction_special.map((dir) => (<>
                <div className={`button_base search_${name[0]}`}>{route_num}</div>
                <div className={`${name[1]}_route_info`}><h2>往：{dir}</h2></div>
                <button className='button_base'>選擇</button>
            </>));
        }
        select_dir_div = (
            <div className="component">
                <h2 className="section_title">選擇目的地</h2>
                <div className="list_dir">
                    {dir_div}
                    {dir_special_div}
                </div>
                <hr/>
            </div>
        )
    } else {
        select_dir_div = null;
    }


    return (
        <div>
            <div className="component">
                <h2 className="section_title">選擇巴士公司</h2>
                <div id="choose_company">
                    <button onClick={() => {chooseCompany("kmb")}} className={`button_base ${company === "kmb" ? "search_kmb" : "search_not"}`}>九巴</button>
                    <button onClick={() => {chooseCompany("ctb")}} className={`button_base ${company === "ctb" ? "search_ctb" : "search_not"}`}>城巴</button>
                    <button onClick={() => {chooseCompany("")}} className={`button_base ${company === "gmb" ? "search_gmb" : "search_not"}`}>重選</button>
                </div>
                <hr/>
            </div>
            {letter_pad_div}
            {select_dir_div}
        </div>
    )
        {/*<div className="component" >*/}
        {/*    <div id="select_dir">*/}
        {/*        <h2 className="section_title">選擇目的地</h2>*/}
        {/*        <div className="list_dir" id="list_dir"></div>*/}
        {/*        <hr/>*/}
        {/*    </div>*/}
        {/*    <div id="select_stop">*/}
        {/*        <h2 className="section_title">選擇車站</h2>*/}
        {/*        <div id="list_stop"></div>*/}
        {/*    </div>*/}
        {/*    <div id="show_eta">*/}
        {/*        <h2 className="section_title">~ 到站時間 ~</h2>*/}
        {/*        <div id="chosen_stop"></div>*/}
        {/*        <div className="time"></div>*/}
        {/*    </div>*/}
        {/*</div>*/}
}
