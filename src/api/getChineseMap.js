import axios from "axios";

const instance = axios.create({
    httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false // 忽略证书验证
    })
});

export default instance.get('https://geojson.cn/api/china/china.json');



