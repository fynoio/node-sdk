const axios = require("axios");
const axiosRetry = require("axios-retry");

class Event {
    constructor(endpoint, headers, event, payload) {
        // Single event trigger API endpoint is prepared
        this.endpoint = new URL("event", endpoint).href;
        this.payload = { event, ...payload };
        this.headers = headers;

        if (Array.isArray(payload)) {
            // Bulk event trigger API endpoint is prepared
            this.endpoint = new URL("event/bulk", endpoint).href;
            this.payload = { event, batch: payload };
        }

        axiosRetry(axios, {
            retries: 3, // number of retries
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => {
                // if retry condition is not specified, by default idempotent requests are retried
                return (
                    error?.response?.status !== 202 &&
                    error?.response?.status !== 401
                );
            },
        });
    }

    trigger = async () => {
        return new Promise((resolve, reject) => {
            axios
                .post(this.endpoint, this.payload, { headers: this.headers })
                .then((resp) => {
                    resolve(resp.data);
                })
                .catch((error) => {
                    reject(error.response?.data);
                });
        });
    };
}

module.exports = {
    Event,
};
