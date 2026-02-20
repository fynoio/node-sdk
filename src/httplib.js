const axios = require("axios");
const httpsKeepAlive = require("node:https");
const httpKeepAlive = require("node:http");

const { HttpsProxyAgent } = require("https-proxy-agent");

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

let httpsAgent;
let httpAgent;
let axiosInstance;

if (proxyUrl) {
    const proxyKeepAlive =
        process.env.PROXY_KEEP_ALIVE === undefined
            ? true
            : String(process.env.PROXY_KEEP_ALIVE).toLowerCase() !== "false";

    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    proxyAgent.keepAlive = proxyKeepAlive;
    axiosInstance = axios.create({
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent,
    });
} else {
    httpsAgent = new httpsKeepAlive.Agent({ keepAlive: true });
    httpAgent = new httpKeepAlive.Agent({ keepAlive: true });

    axiosInstance = axios.create({
        httpsAgent,
        httpAgent,
    });
}

module.exports = {
    axiosInstance,
};
