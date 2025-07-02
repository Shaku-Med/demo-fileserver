export const VerifyIp = async (ip: string) => {
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

export async function getClientIP(headers: any) {
    let ips =  (
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      headers.get('x-client-ip') ||
      headers.get('fastly-client-ip') ||
      headers.get('true-client-ip') ||
      headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      headers.get('x-forwarded') ||
      headers.get('x-cluster-client-ip') ||
      headers.get('forwarded-for') ||
      headers.get('forwarded') ||
      headers.get('via') ||
      'unknown'
    );

    return await VerifyIp(ips) ? ips : null;
}