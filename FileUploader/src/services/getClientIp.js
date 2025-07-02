const VerifyIp = async (ip) => {
    try {
        let regex = /^(\d{1,3}\.){3}\d{1,3}$/; // 192.168.1.1

        if(!regex.test(ip) && process.env.NODE_ENV === 'production'){
            return false;
        }

        // let response = await fetch(`https://ipinfo.io/${ip}/json`);
        // let data = await response.json();
        // console.log("data", data)
        // if(data.ip === ip){
        //     return true;
        // }
        // return false;
        return true;
    }
    catch {
        return false;
    }
}

async function getClientIP(headers) {
    let ips =  (
      headers['x-real-ip'] ||
      headers['cf-connecting-ip'] ||
      headers['x-client-ip'] ||
      headers['fastly-client-ip'] ||
      headers['true-client-ip'] ||
      headers['x-forwarded-for']?.split(',')[0].trim() ||
      headers['x-forwarded'] ||
      headers['x-cluster-client-ip'] ||
      headers['forwarded-for'] ||
      headers['forwarded'] ||
      headers['via'] ||
      'unknown'
    );

    return await VerifyIp(ips) ? ips : null;
}

module.exports = getClientIP