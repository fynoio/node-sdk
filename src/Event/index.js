const axios = require("axios");

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
    }

    trigger = async () => {
        return new Promise((resolve, reject) => {
            axios
                .post(this.endpoint, this.payload, { headers: this.headers })
                .then((resp) => {
                    resolve(resp.data);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    };
}

module.exports = {
    Event,
};
