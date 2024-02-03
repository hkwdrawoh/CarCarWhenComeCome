import React, { useState, useEffect } from "react";
import { FetchETA, compareTime } from "./fetchBusAPI";
import {eventEmitter} from "./App";
import {LoaderComponent} from "./SmallComponents";
import {GridItem, Text, VStack} from "@chakra-ui/react";


export default function ETADisplay(props) {

    const initState = {
        eta: [['', '', ''], ['', 'loading', ''], ['', '', '']],
        animation: [[false, false, false], [false, false, false], [false, false, false]]
    }

    const [state, setState] = useState(initState);

    useEffect(() => {
        eventEmitter.on('refreshETA', fetchETA);

        return (() => {
            eventEmitter.off('refreshETA', fetchETA);
        });
    }, [props, state]);

    useEffect(() => {
        if (props.stop_id !== null) {
            fetchETA().then();
        }
    }, [props]);

    const fetchETA = async () => {
        if (props.stop_id !== null) {
            let temp_ani = initState.animation;
            let temp_eta;
            let data = await generateETA(props.route_num, props.route.direction, props.route.service_type, props.route.seq, props.stop_id, props.route.company);
            temp_eta = structuredClone(data);
            if (props.joint !== null && props.joint !== undefined) {
                let temp_eta2;
                let data = await generateETA(props.joint.route, props.joint.direction, props.joint.service_type, props.joint.seq, props.joint.stop_id, props.joint.company);
                temp_eta2 = structuredClone(data);
                for (let i = 0; i < 3; i++) {
                    if (props.route.company === "kmb") {
                        temp_eta[i][2] = (temp_eta[i][2] === "") ? "九巴" : "九巴，" + temp_eta[i][2];
                        temp_eta2[i][2] = (temp_eta2[i][2] === "") ? "城巴" : "城巴，" + temp_eta2[i][2];

                    } else {
                        temp_eta[i][2] = (temp_eta[i][2] === "") ? "城巴" : "城巴，" + temp_eta[i][2];
                        temp_eta2[i][2] = (temp_eta2[i][2] === "") ? "九巴" : "九巴，" + temp_eta2[i][2];
                    }
                }
                let combined_eta = [...temp_eta, ...temp_eta2].filter(item => item[0] !== "").sort((a, b) => (a[1] > b[1]) ? 1 : -1);
                console.log(combined_eta);
                temp_eta = Array(3).fill(['', '', '']).map((_, index) => combined_eta[index] || ['', '', '']);
                temp_eta[0] = (JSON.stringify(temp_eta[0]) === JSON.stringify(["", "", ""])) ? ['', '未來1個鐘都冇車', ''] : temp_eta[0];
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    temp_ani[i][j] = state.eta[i][j] !== temp_eta[i][j];
                }
            }
            setState({eta: temp_eta, animation: temp_ani});
            setTimeout(() => {
                setState({eta: temp_eta, animation: initState.animation});
            }, 1000);
        }
    }

    async function generateETA(route, dir, serv, seq, stop_id, company)  {
        let temp_eta = initState.eta;
        let output = await FetchETA(route, dir, serv, seq, stop_id, company);
        temp_eta[1][1] = (temp_eta[1][1] === 'loading') ? '' : temp_eta[1][1];
        for (let i = 0; i < 3; i++) {
            let record = output[i];
            if (i === 0 && (record === undefined || record.eta === null)) {
                temp_eta = [['', '未來1個鐘都冇車', ''], ['', '', ''], ['', '', '']];
            } else if (record === undefined) {
                temp_eta[i] = ['', '', ''];
            } else if (record.eta === null) {
                temp_eta[i] = ['null', '', ''];
            } else {
                temp_eta[i][0] = compareTime(record.eta) + " min";
                temp_eta[i][1] = record.eta.slice(11, 19);
            }
            if (record !== undefined && (record.rmk_tc !== "" && record.rmk_tc !== null)) {
                temp_eta[i][2] = record.rmk_tc;
            } else {
                temp_eta[i][2] = '';
            }
            if (temp_eta[i][0] === "NaN min") {
                temp_eta[i] = ['', '', ''];
            }
        }
        return temp_eta;
    }

    if (state.eta[1][1] === 'loading') {
        return <>
            <GridItem colSpan={3}>
                <LoaderComponent/>
            </GridItem>
        </>
    } else if (state.eta[0][1] === '未來1個鐘都冇車') {
        return <>
            <GridItem colSpan={3}>
                <VStack spacing={0}>
                    <Text fontSize='xl' as='b'>{`\u00A0`}</Text>
                    <Text fontSize='lg' as='b' className={`flash-animation ${state.animation[1][1] ? "show" : ""}`}>{state.eta[0][1]}</Text>
                    <Text>{`\u00A0`}</Text>
                </VStack>
            </GridItem>
        </>
    } else {
        return <>
            {state.eta.map((record, index) => <>
                <GridItem>
                    <VStack spacing={0}>
                        <Text fontSize='xl' as='b' className={`flash-animation ${state.animation[index][0] ? "show" : ""}`}>{record[0] || `\u00A0`}</Text>
                        <Text fontSize='lg' as='b' className={`flash-animation ${state.animation[index][1] ? "show" : ""}`}>{record[1] || `\u00A0`}</Text>
                        <Text color='cyan.600' className={`flash-animation ${state.animation[index][2] ? "show" : ""}`}>{record[2] || `\u00A0`}</Text>
                    </VStack>
                </GridItem>
            </>)}
        </>
    }

}
