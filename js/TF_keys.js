/*
Script Author: DecoAri
Fix Author: GGcover
Reference: https://raw.githubusercontent.com/nhutggvn/Config-VPN/main/js/TF_keys.js
Specific Usage Steps:
1: Import the plugin.
2: Enable Mitm over Http2 on the Mitm page.
3: Start VPN, enter TestFlight App, and display notification of successful information retrieval.
4: Go to Configuration -> Persistent Data -> Import Specified Data. Fill in key with "APP_ID", and value with the ID of the TF you want to join. (ID is the string after "join" in the link https://testflight.apple.com/join/LPQmtkUs, for example, "LPQmtkUs".) ⚠️: Supports an unlimited number of TF links, each link needs to be separated by a comma (such as: LPQmtkUs, Hgun65jg, 8yhJgv)
*/

const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/(.*)/;

if (reg1.test($request.url)) {
    $persistentStore.write(null, 'request_id');
    let url = $request.url;
    let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2');
    let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id'];
    let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest'];
    let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id'];
    let ua = $request.headers['User-Agent'] || $request.headers['user-agent'];

    $persistentStore.write(key, 'key');
    $persistentStore.write(session_id, 'session_id');
    $persistentStore.write(session_digest, 'session_digest');
    $persistentStore.write(request_id, 'request_id');
    $persistentStore.write(ua, 'tf_ua');

    console.log($request.headers);

    if ($persistentStore.read('request_id') !== null) {
        $notification.post('TF Information Acquisition', 'Information acquisition successful. Please close the script!', '');
    } else {
        $notification.post('TF Information Acquisition', 'Information acquisition failed. Please turn on Mitm over HTTP2, and restart VPN and TestFlight App!', '');
    }

    $done({});
}

if (reg2.test($request.url)) {
    let appId = $persistentStore.read("APP_ID");
    if (!appId) {
        appId = "";
    }
    let arr = appId.split(",");
    const id = reg2.exec($request.url)[1];
    arr.push(id);
    arr = unique(arr).filter((a) => a);
    if (arr.length > 0) {
        appId = arr.join(",");
    }
    $persistentStore.write(appId, "APP_ID");
    $notification.post("TestFlight Auto Join", `APP_ID added: ${id}`, `Current IDs: ${appId}`);
    $done({});
}

function unique(arr) {
    return Array.from(new Set(arr));
}
