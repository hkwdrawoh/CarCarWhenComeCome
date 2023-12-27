import kmb_stops from "./kmb_stop.json"

const api_kmb = "https://data.etabus.gov.hk/v1/transport/kmb"
const api_ctb = "https://rt.data.gov.hk/v2/transport/citybus"
const api_gmb = "https://data.etagmb.gov.hk"

async function GetJSON(url) {
    let json_data;
    const response = await fetch(url);
    json_data = await response.json();
    return json_data;
}

export async function FetchRoute(route, direction, service_type, company) {
    let api_url;
    if (company === "kmb") {
        if (direction === "O") {
            api_url = api_kmb + "/route/" + route + "/outbound/" + service_type;
        } else {
            api_url = api_kmb + "/route/" + route + "/inbound/" + service_type;
        }
    } else if (company === "ctb") {
        api_url = api_ctb + "/route/CTB/" + route;
    } else if (company === "gmb_hki") {
        api_url = api_gmb + "/route/HKI/" + route;
    } else if (company === "gmb_kln") {
        api_url = api_gmb + "/route/KLN/" + route;
    }
    let data = await GetJSON(api_url);
    let output = [];
    let record = data.data;
    // console.log(data);
    if (company.substring(0, 3) === "gmb") {
        if (direction === "O") {
            output.push(record[0].directions[0].dest_tc, record[0].directions[0].orig_tc, record[0].route_id);
        } else {
            output.push(record[0].directions[0].orig_tc, record[0].directions[0].dest_tc, record[0].route_id);
        }
    } else {
        if (company === "ctb" && direction === "I") {
            output.push(record.orig_tc, record.dest_tc);
        } else {
            output.push(record.dest_tc, record.orig_tc);
        }
    }
    return output;
}

export async function FetchRouteStop(route, direction, service_type, seq, company) {
    let api_url;
    if (company === "kmb") {
        if (direction === "O") {
            api_url = api_kmb + "/route-stop/" + route + "/outbound/" + service_type;
        } else {
            api_url = api_kmb + "/route-stop/" + route + "/inbound/" + service_type;
        }
    } else if (company === "ctb") {
        if (direction === "O") {
            api_url = api_ctb + "/route-stop/CTB/" + route + "/outbound";
        } else {
            api_url = api_ctb + "/route-stop/CTB/" + route + "/inbound";
        }
    } else if (company.substring(0, 3) === "gmb") {
        if (direction === "O") {
            api_url = api_gmb + "/route-stop/" + route + "/1";
        } else {
            api_url = api_gmb + "/route-stop/" + route + "/1";
        }
    }
    // console.log(api_url);
    let data = await GetJSON(api_url);
    let output = [];
    // console.log(data);
    if (company.substring(0, 3) === "gmb") {
        for (let i = 0; i < data.data.route_stops.length; i++) {
            let record = data.data.route_stops[i];
            if (record.stop_seq == seq) {
                output.push(record.stop_id, record.name_tc, record.name_en);
            }
        }
    } else if (seq === "-1") {
        if (data.data.length !== 0) {
            output = data.data.map(item => item.stop);
        }
    } else {
        for (let i = 0; i < data.data.length; i++) {
            let record = data.data[i];
            if (record.seq == seq) {
                output.push(record.stop);
            }
        }
    }
    // console.log(output);
    return output;
}

export async function FetchStop(stop_id, company) {
    let api_url;
    let data;
    if (company === "kmb") {
        api_url = "../local_json/kmb_stop.json";
        data = kmb_stops;
    } else if (company === "ctb") {
        api_url = api_ctb + "/stop/" + stop_id;
        data = await GetJSON(api_url);
    }
    let output = [];
    let record;
    // console.log(stop_id, data.data);
    if (company === "ctb") {
        record = [data.data];
    } else {
        record = data.data.filter(item => item.stop === stop_id);
    }
    // console.log(record);
    output.push(record[0].name_tc, record[0].name_en);
    return output;
}

export async function FetchETA(route, direction, service_type, seq, stop_id, company) {
    let api_url;
    if (company === "kmb") {
        api_url = api_kmb + "/eta/" + stop_id + "/" + route + "/" + service_type;
    } else if (company === "ctb") {
        api_url = api_ctb + "/eta/CTB/" + stop_id + "/" + route;
    } else if (company.substring(0, 3) === "gmb") {
        api_url = api_gmb + "/eta/route-stop/" + route + "/" + stop_id;
    }
    // console.log(route, api_url);
    let data = await GetJSON(api_url);
    let output = [];
    if (company.substring(0, 3) === "gmb") {
        for (let i = 0; i < data.data.length; i++) {
            let records = data.data[i];
            if (records.stop_seq == seq && records.enabled == true) {
                for (let j = 0; j < records.eta.length; j++) {
                    let record = records.eta[j];
                    record.eta = record.timestamp;
                    record.rmk_tc = record.remarks_tc;
                    output.push(record);
                }
            }
        }
    } else {
        for (let i = 0; i < data.data.length; i++) {
            let record = data.data[i];
            if (record.seq == seq && record.dir === direction || record.co === "CTB") {
                output.push(record);
            }
        }
    }
    // console.log(output);
    return output;
}
/*
async function FetchAllStops(stops) {
    for (let i = 0; i < stops.length; i++) {
        routes.innerHTML += loading_div;
        let eta_div = "<div class='eta'>";
        let stop = stops[i];
        let route_num = stop.route;
        let terminus = await FetchRoute(route_num, stop.direction, stop.service_type, stop.company);
        if (stop.company.substring(0, 3) === "gmb") {route_num = terminus[2];}
        let route_stop = await FetchRouteStop(route_num, stop.direction, stop.service_type, stop.seq, stop.company);
        let stop_name;
        if (stop.company.substring(0, 3) === "gmb") {
            stop_name = [route_stop[1], route_stop[2]];
        } else {
            stop_name = await FetchStop(route_stop[0], stop.company);
        }
        let records = await FetchETA(route_num, stop.direction, stop.service_type, stop.seq, route_stop[0], stop.company);

        // Route Number
        if (stop.style % 10 === 1) {
            eta_div += "<div class='KMB_route_num'><h1>" + stop.route + "</h1></div>";
        } else if (stop.style % 10 === 2) {
            eta_div += "<div class='CTB_route_num'><h1>" + stop.route + "</h1></div>";
        } else if (stop.style % 10 === 3) {
            eta_div += "<div class='GMB_route_num'><h1>" + stop.route + "</h1></div>";
        } else if (stop.style % 10 === 4) {
            eta_div += "<div class='CTY_route_num'><h1>" + stop.route + "</h1></div>";
        } else if (stop.style % 10 === 5) {
            eta_div += "<div class='LWB_route_num'><h1>" + stop.route + "</h1></div>";
        } else {
            eta_div += "<div class='KMB_route_num'><h1>" + stop.route + "</h1></div>";
        }


        // Station name and Direction
        if (stop.style % 10 === 1) {
            eta_div += "<div class='KMB_route_info'>";
        } else if (stop.style % 10 === 2) {
            eta_div += "<div class='CTB_route_info'>";
        } else if (stop.style % 10 === 3) {
            eta_div += "<div class='GMB_route_info'>";
        } else if (stop.style % 10 === 4) {
            eta_div += "<div class='CTY_route_info'>";
        } else if (stop.style % 10 === 5) {
            eta_div += "<div class='LWB_route_info'>";
        } else {
            eta_div += "<div class='KMB_route_info'>";
        }
        eta_div += "<h3>" + stop_name[0] + "</h3>";
        if (Math.floor(stop.style / 10) === 1) {
            eta_div += "<p>往：" + terminus[1] + "</p>";
        } else {
            eta_div += "<p>往：" + terminus[0] + "</p>";
        }
        eta_div += "</div>";

        // Station ETA
        eta_div += "<div class='time'>";
        for (let i = 0; i < 3; i++) {
            let record = records[i];
            if (i === 0 && (record === undefined || record.eta === null)) {
                eta_div += "<div><h3>未來60分鐘<br />一架車都冇</h3>";
            } else if (record === undefined) {
                eta_div += "<div><h2>&emsp;</h2><h3>&emsp;</h3>";
            } else if (record.eta === null) {
                eta_div += "<div><h2>null</h2><h3>&emsp;</h3>";
            } else {
                eta_div += "<div><h2>" + CompareTime(timenow, record.eta.slice(11, 19)) + " min</h2><h3>(" + record.eta.slice(11, 19) + ')</h3>';
            }
            // console.log(record)
            if (record !== undefined && (record.rmk_tc !== "" && record.rmk_tc !== null)) {
                eta_div += "<p class='rmk'>" + record.rmk_tc + "</p></div>";
            } else {
                eta_div += "<p>&emsp;</p></div>";
            }
        }

        eta_div += "</div></div>";
        routes.innerHTML += eta_div;
        routes.innerHTML += "<hr>";
        routes.innerHTML = routes.innerHTML.replace(loading_div, "");
    }
}

function RefreshRoute() {
    let currentURL = window.location.href;
    if (currentURL.includes("set_OnTai")) {
        ShowOnTai().then();
    } else if (currentURL.includes("set_Rhythm")) {
        ShowRhythm().then();
    } else if (currentURL.includes("set_LaiTak")) {
        ShowLaiTak().then();
    } else if (currentURL.includes("set_108")) {
        Show108().then();
    } else {
        ShowShunLee().then();
    }
}


*/