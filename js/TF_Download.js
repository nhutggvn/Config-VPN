/*
Script Author: NobyDa
Fix Author: GGcover
Reference: https://raw.githubusercontent.com/nhutggvn/Config-VPN/main/js/TF_Download.js
*/
let app = JSON.parse($request.body);
app.storefrontId = '143441-19,29';
$done({body:JSON.stringify(app)});
