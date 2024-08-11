import React, { useState, useEffect } from 'react';
import Header from "./Header";
import SearchStop from "./SearchStop";
import kmb_route_json from "./json/kmb_route.json"
import ctb_route_json from "./json/ctb_route.json"
import special_route_json from "./json/special_route.json"
import bus_route_info_json from "./json/bus_route-info.json";
import {v4 as uuidv4} from 'uuid';
import {Button, Center, HStack, Icon, Text} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {MdBookmark} from "react-icons/md";
import RouteETA from "./RouteETA";


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
    const [direction_special, setDirectionSpecial] = useState([]);
    const [selected_dest, setSelectedDest] = useState([]);
    const [pinned_route, setPinnedRoute] = useState({
        "id": "-2",
        "route": "",
        "direction": "",
        "service_type": 0,
        "seq": 0,
        "company": "",
        "style": 0,
        "joint": null
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
        setDirectionSpecial([]);
        if (newAvailRoutes.includes(newRouteNum) && newRouteNum !== "") {
            let dir = kmb_routes.filter(item => item.route === newRouteNum).sort((a, b) => a.service_type - b.service_type);
            if (dir.length !== 0) {
                setDirection(dir.filter(item => item.service_type === "1"));
                setDirectionSpecial(dir.filter(item => item.service_type !== "1"));
            }
            if (!joint_routes.includes(newRouteNum)) {
                let dir = ctb_routes.filter(item => item.route === newRouteNum);
                if (dir.length !== 0) {
                    setDirection(prevDir => [...prevDir, dir[0]]);
                    if (!ctb_circular_routes.includes(newRouteNum)) {
                        setDirectionSpecial([dir[0]]);
                    }
                }
            }
        }
    }

    const selectDest = (dir, dest, bound, company, style) => {
        // Find Route ID
        let results = bus_route_ids.filter((a) => (a.company.includes(company.toUpperCase()) || a.company.includes("LWB")) && String(a.route) === route_num);
        setSelectedDest([dir, dest, bound, company, style, (results[0] ? results[0].route_id : undefined), (results[0] ? results[0].journey_time : undefined)]);
    }


    let letters_div = null;
    if (avail_letter.filter(item => /^[A-Za-z]$/.test(item)).length !== 0) {
        letters_div = avail_letter.filter(item => /^[A-Za-z]$/.test(item)).map((letter) => (
            <button onClick={() => {chooseRoute(letter)}}  className='button_base button_number' disabled={!avail_letter.includes(letter)}>{letter}</button>
        ))
    }

    let select_dir_div = null;
    let dir_div1 = null;
    let dir_special_div1 = null;
    let dir_div2 = null;
    let dir_special_div2 = null;
    if (direction.length !== 0) {
        let style1;
        if (joint_routes.includes(route_num)) {
            style1 = 'jor';
        } else if (route_num.at(0) === "A" || route_num.at(0) === "E" || route_num.at(0) === "S" || route_num.slice(0, 2) === "NA") {
            style1 = 'lwb';
        } else {
            style1 = 'kmb';
        }
        dir_div1 = direction.filter((item) => item.co === undefined).map((dir) => (<>
            <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", style1)}}>
                <div className={`button_base ${style1}_icon`}>{dir.route}</div>
                <div className={`text_left grid-span4 ${style1}_text`}><h2>往: {dir.dest_tc}</h2></div>
                <Center><ChevronRightIcon boxSize={7} /></Center>
            </div>
        </>));
        dir_special_div1 = direction_special.filter((item) => item.co === undefined).map((dir) => (<>
            <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, dir.bound, "kmb", style1)}}>
                <div className={`button_base ${style1}_icon`}>{dir.route}</div>
                <div className={`text_left grid-span4 ${style1}_text`}><h2>往: {dir.dest_tc}</h2><h3>(特別班次)</h3></div>
                <Center><ChevronRightIcon boxSize={7} /></Center>
            </div>
        </>))
        let style2;
        if (joint_routes.includes(route_num)) {
            style2 = 'jor';
        } else if (route_num.at(0) === "A" || route_num.slice(0, 2) === "NA") {
            style2 = 'cty';
        } else {
            style2 = 'ctb';
        }
        dir_div2 = direction.filter((item) => item.co !== undefined).map((dir) => (<>
            <div className="grid-6-fixed list_button"  onClick={() => {selectDest(dir, dir.dest_tc, "O", "ctb", style2)}}>
                <div className={`button_base ${style2}_icon`}>{dir.route}</div>
                <div className={`text_left grid-span4 ${style2}_text`}><h2>往: {dir.dest_tc}</h2></div>
                <Center><ChevronRightIcon boxSize={7} /></Center>
            </div>
        </>));
        dir_special_div2 = direction_special.filter((item) => item.co !== undefined).map((dir) => (<>
            <div className='grid-6-fixed list_button' onClick={() => {selectDest(dir, dir.orig_tc, "I", "ctb", style2)}}>
                <div className={`button_base ${style2}_icon`}>{dir.route}</div>
                <div className={`text_left grid-span4 ${style2}_text`}><h2>往: {dir.orig_tc}</h2></div>
                <Center><ChevronRightIcon boxSize={7} /></Center>
            </div>
        </>));
        select_dir_div = <>
            {dir_div1}
            {dir_special_div1}
            {dir_div2}
            {dir_special_div2}
        </>
    }
    const pinRoute = (seq, joint) => {
        const routes = structuredClone(selected_dest);
        const service_type = routes[0].service_type || 1;

        const pinning_route = {
            "id": routes[3] + routes[0].route + seq,
            "route": routes[0].route,
            "direction": routes[2],
            "service_type": service_type,
            "seq": seq,
            "company": routes[3],
            "style": ["kmb", "ctb", "gmb", "cty", "lwb", "jor"].indexOf(routes[4]) + 1,
            "joint": joint
        };

        console.log(pinning_route);

        setPinnedRoute(pinning_route);
    }

    const unpinRoute = () => {
        setPinnedRoute({
            "id": "-1",
            "route": "",
            "direction": "",
            "service_type": 0,
            "seq": 0,
            "company": "",
            "style": 0,
            "joint": null
        })
    }


    if (JSON.stringify(selected_dest) !== JSON.stringify([])) {
        return <>
            <div className="container">
                <div className="container_top">
                    <Header text="" goPage={props.goPage} />
                    {pinned_route.route !== "" ? <>
                        <HStack spacing={0} w="100%">
                            <Button size='xl' height="60%" variant='ghost' colorScheme='white' onClick={unpinRoute}><Icon as={MdBookmark} /></Button>
                            <RouteETA key={pinned_route.id} route={pinned_route} />
                        </HStack>
                        <hr />
                    </> : <></>}
                    <HStack spacing={2} w="100%">
                        <Button size='xxxl' variant='ghost' colorScheme='white' onClick={() => setSelectedDest([])}><ChevronLeftIcon /></Button>
                        <div className={`button_base ${selected_dest[4]}_icon`} style={{margin: 0}}>{route_num}</div>
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
                    {pinned_route.route !== "" ? <>
                        <HStack spacing={0} w="100%">
                            <Button size='xl' height="60%" variant='ghost' colorScheme='white' onClick={unpinRoute}><Icon as={MdBookmark} /></Button>
                            <RouteETA key={pinned_route.id} route={pinned_route} />
                        </HStack>
                        <hr />
                    </> : <></>}
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
