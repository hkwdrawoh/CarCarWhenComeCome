import React, { useState, useEffect } from 'react';
import Header from "./Header";
import SearchStop from "./SearchStop";
import kmb_route_json from "./json/kmb_route.json"
import ctb_route_json from "./json/ctb_route.json"
import special_route_json from "./json/special_route.json"
import bus_route_info_json from "./json/bus_route-info.json";
import {v4 as uuidv4} from 'uuid';
import {Button, Center, HStack, Text} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {MdBookmark} from "react-icons/md";
import ETADisplay from "./ETADisplay";


export default function SearchContainer(props) {

    // KMB Route List API URL: https://data.etabus.gov.hk/v1/transport/kmb/route
    // KMB Stop List API URL: https://data.etabus.gov.hk/v1/transport/kmb/stop
    // CTB Route List API URL: https://rt.data.gov.hk/v2/transport/citybus/route/CTB
    const kmb_routes = kmb_route_json.data;
    const ctb_routes = ctb_route_json.data;
    const joint_routes = special_route_json.data.joint_routes;
    const ctb_circular_routes = special_route_json.data.ctb_circular_routes;
    const bus_route_ids = bus_route_info_json.data.routes;
    const kmb_route_list = [...new Set(kmb_routes.map(item => item.route))];
    const ctb_route_list = [...new Set(ctb_routes.map(item => item.route))];


    const [routes_list, setRoutesList] = useState([...kmb_route_list, ...ctb_route_list]);
    const [route_num, setRouteNum] = useState('');
    const [avail_letter, setAvailLetter] = useState([]);
    const [direction, setDirection] = useState([]);
    const [selected_dest, setSelectedDest] = useState([]);
    const [pinned_route, setPinnedRoute] = useState({
        "stop_id": "",
        "route": "",
        "direction": "",
        "service_type": 0,
        "seq": 0,
        "company": "",
        "joint": null,
        "class": "",
        "dest": "",
        "stop_name": ""
    });

    useEffect(() => {
        updateAvail("").then();
    }, [routes_list]);

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
        if (newRouteNum !== "") {
            let dir1 = kmb_routes.filter(item => item.route.startsWith(newRouteNum));
            if (dir1.length) {
                setDirection(dir1);
            }
            let dir2 = ctb_routes.filter(item => item.route.startsWith(newRouteNum) && !joint_routes.includes(item.route));
            if (dir2.length) {
                setDirection(prevDir => [...prevDir, ...dir2, ...dir2.filter(item => !ctb_circular_routes.includes(item.route))].sort(function(a, b) {
                    const routeA = a.route.toString();
                    const routeB = b.route.toString();
                    const routeA1 = isNaN(routeA.charAt(routeA.length - 1)) ? routeA.substring(0, routeA.length - 1) : routeA;
                    const routeB1 = isNaN(routeB.charAt(routeB.length - 1)) ? routeB.substring(0, routeB.length - 1) : routeB;

                    if (routeA1.length < routeB1.length) return -1;
                    if (routeA1.length > routeB1.length) return 1;
                    if (routeA1 < routeB1) return -1;
                    if (routeA1 > routeB1) return 1;
                    if (routeA.length < routeB.length) return -1;
                    if (routeA.length > routeB.length) return 1;
                    if (routeA.charAt(routeA.length - 1) < routeB.charAt(routeB.length - 1)) return -1;
                    if (routeA.charAt(routeA.length - 1) > routeB.charAt(routeB.length - 1)) return 1;
                    if (a.service_type < b.service_type) return -1;
                    if (a.service_type > b.service_type) return 1;

                    // if (routeA.substring(0, routeA.length - 1) < routeB.substring(0, routeB.length - 1)) return -1;
                    // if (routeA.substring(0, routeA.length - 1) > routeB.substring(0, routeB.length - 1)) return 1;
                    return 0;
                }));
            }
        }
    }

    const selectDest = (dir, dest, bound, company, style) => {
        // Find Route ID
        let results = bus_route_ids.filter((a) => (a.company.includes(company.toUpperCase()) || a.company.includes("LWB")) && String(a.route) === dir.route);
        setSelectedDest([dir, dest, bound, company, style, (results[0] ? results[0].route_id : undefined), (results[0] ? results[0].journey_time : undefined)]);
    }


    let letters_div = null;
    if (avail_letter.filter(item => /^[A-Za-z]$/.test(item)).length !== 0) {
        letters_div = avail_letter.filter(item => /^[A-Za-z]$/.test(item)).map((letter) => (
            <button onClick={() => {chooseRoute(letter)}}  className='button_base button_number' disabled={!avail_letter.includes(letter)}>{letter}</button>
        ))
    }

    let select_dir_div = null;
    if (direction.length !== 0) {
        let style2;
        if (route_num.at(0) === "A" || route_num.slice(0, 2) === "NA") {
            style2 = 'cty';
        } else {
            style2 = 'ctb';
        }
        select_dir_div = direction.map((dir, index) => <>{
            joint_routes.includes(dir.route) ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", "jor")}}>
                    <div className={`button_base jor_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 jor_text`}><h2>往: {dir.dest_tc}</h2><h3>{dir.service_type === "1" ? "" : "(特別班次)"}</h3></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : dir.co === undefined && (["A", "E", "S"].includes(dir.route.at(0)) || dir.route.slice(0, 2) === "NA") ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", "lwb")}}>
                    <div className={`button_base lwb_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 lwb_text`}><h2>往: {dir.dest_tc}</h2><h3>{dir.service_type === "1" ? "" : "(特別班次)"}</h3></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : dir.co === undefined ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", "kmb")}}>
                    <div className={`button_base kmb_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 kmb_text`}><h2>往: {dir.dest_tc}</h2><h3>{dir.service_type === "1" ? "" : "(特別班次)"}</h3></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : (dir.route.at(0) === "A" || dir.route.slice(0, 2) === "NA") && direction[index-1] && direction[index-1].route === dir.route && direction[index-1].co !== undefined ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.orig_tc, "I", "ctb", "cty")}}>
                    <div className={`button_base cty_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 cty_text`}><h2>往: {dir.orig_tc}</h2></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : (dir.route.at(0) === "A" || dir.route.slice(0, 2) === "NA") ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, "O", "ctb", "cty")}}>
                    <div className={`button_base cty_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 cty_text`}><h2>往: {dir.dest_tc}</h2></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : direction[index-1] && direction[index-1].route === dir.route && direction[index-1].co !== undefined ? <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.orig_tc, "I", "ctb", "ctb")}}>
                    <div className={`button_base ${style2}_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 ${style2}_text`}><h2>往: {dir.orig_tc}</h2></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </> : <>
                <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, "O", "ctb", "ctb")}}>
                    <div className={`button_base ${style2}_icon`}>{dir.route}</div>
                    <div className={`text_left grid-span4 ${style2}_text`}><h2>往: {dir.dest_tc}</h2></div>
                    <Center><ChevronRightIcon boxSize={7} /></Center>
                </div>
            </>
        }</>);
    }
    const pinRoute = (seq, joint, stop_id, class_name, dest, stop_name) => {
        const routes = structuredClone(selected_dest);
        const service_type = routes[0].service_type || 1;

        const pinning_route = {
            "stop_id": stop_id,
            "route": routes[0].route,
            "direction": routes[2],
            "service_type": service_type,
            "seq": seq,
            "company": routes[3],
            "joint": joint,
            "class": class_name,
            "dest": dest,
            "stop_name": stop_name
        };

        console.log(pinning_route);

        setPinnedRoute(pinning_route);
    }

    const unpinRoute = () => {
        setPinnedRoute({
            "stop_id": "",
            "route": "",
            "direction": "",
            "service_type": 0,
            "seq": 0,
            "company": "",
            "joint": null,
            "class": "",
            "dest": "",
            "stop_name": ""
        })
    }

    const pinned_div = <>
        <HStack spacing={2} w="100%">
            <Button size='xl' height={10} variant='ghost' colorScheme='white' onClick={unpinRoute}><MdBookmark /></Button>
            <div className={`button_base ${pinned_route.class}_icon`} style={{margin: 0}}>{pinned_route.route}</div>
            <div className={`${pinned_route.class}_text text_left grid-span4`}>
                <h3>往: {pinned_route.dest}</h3>
                <p>{pinned_route.stop_name}</p>
            </div>
        </HStack>
        <div className="grid-3-fixed">
            <ETADisplay key={uuidv4()} route={pinned_route} route_num={pinned_route.route} stop_id={pinned_route.stop_id} joint={pinned_route.joint || null}/>
        </div>
        <hr />
        </>;


    if (JSON.stringify(selected_dest) !== JSON.stringify([])) {
        return <>
            <div className="container">
                <div className="container_top">
                    <Header text="" goPage={props.goPage} />
                    {pinned_route.route !== "" ? pinned_div : <></>}
                    <HStack spacing={2} w="100%">
                        <Button size='xxxl' variant='ghost' colorScheme='white' onClick={() => setSelectedDest([])}><ChevronLeftIcon /></Button>
                        <div className={`button_base ${selected_dest[4]}_icon`} style={{margin: 0}}>{selected_dest[0].route}</div>
                        <div className={`${selected_dest[4]}_text text_left grid-span4`}>
                            <h2>往: {selected_dest[1]}</h2>
                            <p>{selected_dest[6] ? `總行車時間：${selected_dest[6]} 分鐘` : ""}</p>
                        </div>
                    </HStack>
                    <hr />
                </div>
                <div className="container_mid">
                    <SearchStop key={uuidv4()} dir={selected_dest[0]} dest={selected_dest[1]} bound={selected_dest[2]} company={selected_dest[3]} style={selected_dest[4]} route_id={selected_dest[5]} pinRoute={pinRoute}/>
                </div>
                <div className="container_bottom"></div>
            </div>
        </>;
    } else {
        return <>
            <div className="container">
                <div className="container_top">
                    <Header text="" goPage={props.goPage} />
                    {pinned_route.route !== "" ? pinned_div : <></>}
                    <div className="grid-6-fixed">
                        <h2 className="text_right grid-span2">路線：</h2>
                        <div className="button_base route_area grid-span4"><Text fontSize='xl' className={route_num ? "title_text" : "darken_text"}>{route_num || "輸入路線"}</Text></div>
                    </div>
                    <hr />
                </div>
                <div className="container_mid scroll_bar-1">
                    {select_dir_div}
                </div>
                <div className="container_bottom">
                    <hr />
                    <div className="num_pad">
                        <button className='button_base button_number' onClick={() => {chooseRoute("1")}} disabled={!avail_letter.includes("1")}>1</button>
                        <button className='button_base button_number' onClick={() => {chooseRoute("2")}} disabled={!avail_letter.includes("2")}>2</button>
                        <button className='button_base button_number' onClick={() => {chooseRoute("3")}} disabled={!avail_letter.includes("3")}>3</button>
                        <div className="letter_pad grid-span4R grid-align_start scroll_bar-1a">
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
                </div>
            </div>
        </>
    }
}
