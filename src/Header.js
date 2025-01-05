import React, { useState, useEffect } from 'react';
import {eventEmitter} from "./App";
import {
    Button,
    Center,
    Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader,
    DrawerOverlay,
    Grid,
    HStack,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import {FetchLocalJSON} from "./fetchBusAPI";

export default function Header(props) {

    const [time_now, setTimeNow] = useState(new Date());
    const [time_ref, setTimeRef] = useState(new Date());
    const [json_time, setJson_time] = useState(new Date(1704038400000));
    const [animation, setAnimation] = useState(false);
    const { isOpen, onOpen, onClose} = useDisclosure();

    let intervalID1 = null;
    let intervalID2 = null;

    useEffect(() => {
        intervalID1 = setInterval(refreshTimeNow, 1000);
        intervalID2 = setInterval(refreshPage, 30000);

        refreshDataTimestamp();

        return () => {
            clearInterval(intervalID1);
            clearInterval(intervalID2);
        }
    }, []);

    const refreshTimeNow = () => {
        setTimeNow(new Date())
    };

    const refreshPage = () => {
        setTimeRef(new Date())
        setAnimation(true);
        setTimeout(() => {
            setAnimation(false);
        }, 1000);
        eventEmitter.emit('refreshETA');
    };

    const refreshDataTimestamp = () => {
        let retrieve_json = JSON.parse(localStorage.getItem("carcar:kmb_routes"));
        console.log(retrieve_json);
        if (retrieve_json !== null) {
            setJson_time(new Date(retrieve_json.generated_timestamp));
        }
    }

    const refreshJSONData = async () => {
        localStorage.removeItem("carcar:kmb_routes");
        let new_json = await FetchLocalJSON("kmb_routes");
        refreshDataTimestamp();
    }

    const getTimeString = (time) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return time.toLocaleTimeString(undefined, options);
    };

    const getDateTimeString = (time) => {
        const options = {
            dateStyle: 'short',
            timeStyle: 'short',
            hour12: false,
        };
        return time.toLocaleString(undefined, options);
    };

    const changePage = (page) => {
        onClose();
        props.goPage(page);
    }

    return <>
        <HStack spacing={4} mt={3}>
            <Button size='xxl' onClick={onOpen} variant='ghost'><HamburgerIcon /></Button>
            <Grid templateColumns='repeat(3, 1fr)' gap={6} width="100%">
                <Center>
                    <VStack spacing={0}>
                        <Text fontSize='lg' as='b'>{getTimeString(time_now)}</Text>
                        <Text>現在時間</Text>
                    </VStack>
                </Center>
                <Center>
                    <VStack spacing={0}>
                        <Text fontSize='lg' as='b' className={`flash-animation ${animation ? "show" : ""}`}>{getTimeString(time_ref)}</Text>
                        <Text>更新時間</Text>
                    </VStack>
                </Center>
                <Center><Button w={20} onClick={refreshPage}>更新</Button></Center>
            </Grid>
        </HStack>
        <Text fontSize='2xl' as='b' color='cyan.600'>{props.text}</Text>
        <hr/>
        <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
            <DrawerOverlay />
            <DrawerContent bg="#151515">
                <DrawerCloseButton color='white' />
                <DrawerHeader>
                    <Button size='xxl' variant='link' onClick={() => changePage('main')}>我要搭車!</Button>
                </DrawerHeader>
                <DrawerBody>
                    <VStack spacing={2}>
                        <Text fontSize='xl' color='white'>~ 我喺呢度! ~</Text>
                        <Button size='xl' variant='link' onClick={() => changePage('OnTai')}>安泰邨</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('Rhythm')}>采頤花園</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('LaiTakTsuen')}>勵德邨</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('CWB')}>銅鑼灣</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('HomeFrom108')}>108 回家</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('SHT')}>沙田市中心</Button>
                        <br />
                        <Text fontSize='xl' color='white'>~ 我要揀車! ~</Text>
                        <Button size='xl' variant='link' onClick={() => changePage('Search')}>巴士?</Button>
                        <Button size='xl' variant='link' onClick={() => changePage('MTR')}>港鐵!</Button>
                    </VStack>
                </DrawerBody>
                <DrawerFooter>
                    <VStack spacing={1} alignItems="flex-end">
                        <Text color='white'>資料更新時間: {getDateTimeString(json_time)}</Text>
                        <HStack>
                            <Text color='white'>CarCar v2.3.0</Text>
                            <Button size='sm' variant='link' onClick={refreshJSONData}>更新資料</Button>
                        </HStack>
                    </VStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>

}

