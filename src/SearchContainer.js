import React, { useState, useEffect } from 'react';
import Header from "./Header";
import SearchStop from "./SearchStop";
import kmb_route_json from "./kmb_route.json"
import ctb_route_json from "./ctb_route.json"
import special_route_json from "./special_route.json"
import {eventEmitter} from "./App";
import {v4 as uuidv4} from 'uuid';


export default function SearchContainer() {

    const kmb_routes = kmb_route_json.data;
    const ctb_routes = ctb_route_json.data;
    const joint_routes = special_route_json.data.joint_routes;
    const ctb_circular_routes = special_route_json.data.ctb_circular_routes;
    const kmb_route_list = [...new Set(kmb_routes.map(item => item.route))];
    const ctb_route_list = [...new Set(ctb_routes.map(item => item.route))];


    const [routes_list, setRoutesList] = useState([...kmb_route_list, ...ctb_route_list]);
    const [company, setCompany] = useState('jor');
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
        } else if (selected_company === "jor") {
            selected_routes_list = [...kmb_route_list, ...ctb_route_list];
            updateAvail("").then();
            setCompany("jor");
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
            if (company === "kmb" || "jor") {
                let dir = kmb_routes.filter(item => item.route === newRouteNum).sort((a, b) => a.service_type - b.service_type);
                if (dir.length !== 0) {
                    setDirection(dir.filter(item => item.service_type === "1"));
                    setDirectionSpecial(dir.filter(item => item.service_type !== "1"));
                }
            }
            if (company === "ctb" || (company === "jor" && !joint_routes.includes(newRouteNum))) {
                let dir = ctb_routes.filter(item => item.route === newRouteNum);
                if (dir.length !== 0) {
                    if (company === "jor") {
                        setDirection(prevDir => [...prevDir, dir[0]]);
                    } else {
                        setDirection([dir[0]]);
                    }
                    if (!ctb_circular_routes.includes(newRouteNum)) {
                        setDirectionSpecial([dir[0]]);
                    }
                }
            }
        }
    }

    const resetSelectedDest = () => {
        setSelectedDest([]);
    }

    const selectDest = (dir, dest, bound, company, style) => {
        setSelectedDest([dir, dest, bound, company, style]);
    }


    let letters_div = null;
    if (avail_letter.filter(item => /^[A-Za-z]$/.test(item)).length !== 0) {
        letters_div = avail_letter.filter(item => /^[A-Za-z]$/.test(item)).map((letter) => (
            <button onClick={() => {chooseRoute(letter)}}  className='button_base button_number' disabled={!avail_letter.includes(letter)}>{letter}</button>
        ))
    }

    let letter_pad_div;
    if (company !== "") {
        letter_pad_div = (
            <div className="num_pad">
                <button className='button_base button_number' onClick={() => {chooseRoute("1")}} disabled={!avail_letter.includes("1")}>1</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("2")}} disabled={!avail_letter.includes("2")}>2</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("3")}} disabled={!avail_letter.includes("3")}>3</button>
                <div className="letter_pad grid-span4R scroll_bar-1a">
                    {letters_div}
                </div>
                <button className='button_base button_number' onClick={() => {chooseRoute("4")}} disabled={!avail_letter.includes("4")}>4</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("5")}} disabled={!avail_letter.includes("5")}>5</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("6")}} disabled={!avail_letter.includes("6")}>6</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("7")}} disabled={!avail_letter.includes("7")}>7</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("8")}} disabled={!avail_letter.includes("8")}>8</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("9")}} disabled={!avail_letter.includes("9")}>9</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("cancel")}} >取消</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("0")}} disabled={!avail_letter.includes("0")}>0</button>
                <button className='button_base button_number' onClick={() => {chooseRoute("back")}} >⌫</button>
            </div>
        )
    } else {
        letter_pad_div = null;
    }

    let select_dir_div = null;
    let dir_div1 = null;
    let dir_special_div1 = null;
    let dir_div2 = null;
    let dir_special_div2 = null;
    if (direction.length !== 0) {
        if (company === "kmb" || "jor") {
            let style;
            if (route_num.at(0) === "A" || route_num.at(0) === "E" || route_num.at(0) === "S" || route_num.slice(0, 2) === "NA") {
                style = 'lwb';
            } else if (joint_routes.includes(route_num)) {
                style = 'jor';
            } else {
                style = 'kmb';
            }
            dir_div1 = direction.filter((item) => item.co === undefined).map((dir) => (<>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", style)}}>
                    <div className={`button_base ${style}_icon`}>{route_num}</div>
                    <div className={`text_left grid-span4 ${style}_text`}><h2>往：{dir.dest_tc}</h2></div>
                    <h2>→</h2>
                </div>
            </>));
            dir_special_div1 = direction_special.filter((item) => item.co === undefined).map((dir) => (<>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", style)}}>
                    <div className={`button_base ${style}_icon`}>{route_num}</div>
                    <div className={`text_left grid-span4 ${style}_text`}><h2>往：{dir.dest_tc}</h2><h3>(特別班次)</h3></div>
                    <h2>→</h2>
                </div>
            </>))
        }
        if (company === "ctb" || "jor") {
            let style;
            if (route_num.at(0) === "A" || route_num.slice(0, 2) === "NA") {
                style = 'cty';
            } else if (joint_routes.includes(route_num)) {
                style = 'jor';
            } else {
                style = 'ctb';
            } 
            dir_div2 = direction.filter((item) => item.co !== undefined).map((dir) => (<>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, "O", "ctb", style)}}>
                    <div className={`button_base ${style}_icon`}>{route_num}</div>
                    <div className={`text_left grid-span4 ${style}_text`}><h2>往：{dir.dest_tc}</h2></div>
                    <h2>→</h2>
                </div>
            </>));
            dir_special_div2 = direction_special.filter((item) => item.co !== undefined).map((dir) => (<>
                <div className='grid-6-fixed list_button' onClick={() => {selectDest(dir, dir.orig_tc, "I", "ctb", style)}}>
                    <div className={`button_base ${style}_icon`}>{route_num}</div>
                    <div className={`text_left grid-span4 ${style}_text`}><h2>往：{dir.orig_tc}</h2></div>
                    <h2>→</h2>
                </div>
            </>));
        }
        select_dir_div = <>
            {dir_div1}
            {dir_special_div1}
            {dir_div2}
            {dir_special_div2}
        </>
    }


    let componentToRender;
    if (JSON.stringify(selected_dest) !== JSON.stringify([])) {
        componentToRender = <>
            <div className="container">
                <div className="container_top">
                    <Header text={selected_dest[0].route + " 幾時有車？"} />
                </div>
                <div className="container_mid">
                    <SearchStop key={uuidv4()} dir={selected_dest[0]} dest={selected_dest[1]} bound={selected_dest[2]} company={selected_dest[3]} style={selected_dest[4]}/>
                </div>
                <div className="container_bottom"></div>
            </div>
        </>;
    } else {
        componentToRender = <>
            <div className="container">
                <div className="container_top">
                    <Header text="你搭邊架車車？" />
                    <h2>選擇巴士公司</h2>
                    <div className="grid-3-fixed">
                        <button onClick={() => {chooseCompany("jor")}} className={`button_base ${company === "jor" ? "jor_icon" : ""}`}>全部</button>
                        <button onClick={() => {chooseCompany("kmb")}} className={`button_base ${company === "kmb" ? "kmb_icon" : ""}`}>九巴</button>
                        <button onClick={() => {chooseCompany("ctb")}} className={`button_base ${company === "ctb" ? "ctb_icon" : ""}`}>城巴</button>
                    </div>
                    <hr />
                    <div className="grid-6-fixed">
                        <h2 className="text_right grid-span2">路線：</h2>
                        <div className="button_base route_area grid-span4"><p>{route_num || `\u00A0`}</p></div>
                    </div>
                    <hr />
                </div>
                <div className="container_mid scroll_bar-1">
                    {select_dir_div}
                </div>
                <div className="container_bottom">
                    <hr />
                    {letter_pad_div}
                </div>
            </div>
        </>
    }

    return (componentToRender);
}
