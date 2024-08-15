import kmb_stops from "./json/kmb_stop.json"

const api_kmb = "https://thingproxy.freeboard.io/fetch/https://data.etabus.gov.hk/v1/transport/kmb"
const api_ctb = "https://rt.data.gov.hk/v2/transport/citybus"
const api_gmb = "https://data.etagmb.gov.hk"

export function compareTime(eta) {
    const curr_time = new Date();
    const eta_time = new Date(eta);

    if (curr_time > eta_time && Math.abs(eta_time - curr_time) > 240000) {
        curr_time.setHours(curr_time.getHours() - 12);
        eta_time.setHours(eta_time.getHours() + 12);
    }
    let MinuteDiff = Math.floor(Math.abs(eta_time - curr_time + 25000) / (1000 * 60));
    if (curr_time > eta_time) {return 0}
    else if (MinuteDiff === 0) {return "<1"}
    else {return MinuteDiff}
}


export async function GetJSON(url) {
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
            if ((record.seq == seq && record.dir === direction) || record.co === "CTB") {
                output.push(record);
            }
        }
    }
    // console.log(output);
    let seq_set = new Set(output.map(item => item.seq));
    if (seq_set.size > 1) {
        if (seq < 5) {
            output = output.filter(item => item.seq == 1);
        } else {
            output = output.filter(item => item.seq != 1);
        }
    }
    return output;
}