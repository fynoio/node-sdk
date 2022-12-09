const axios = require("axios");

const API_URL = "https://api.fyno.io/v1/";

class Fyno {
    wsid = process.env.FYNO_WSID;
    api_key = process.env.FYNO_API_KEY;
    env = process.env.FYNO_ENV || "prod";

    constructor(wsid = this.wsid, api_key = this.api_key, env = this.env) {
        this.wsid = wsid;
        this.api_key = api_key;
        this.env = env;
        this.api_url = `${API_URL}${this.wsid}${this.getENVUrl()}`;
        this.headers = this.getHeaders();

        this.validate();
    }

    getENVUrl() {
        return `${this.env === "dev" ? "/dev" : ""}`;
    }

    getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${this.api_key}`,
                "Content-Type": "application/json",
            },
        };
    }

    validate() {
        if (!this.wsid || this.wsid.length < 10 || this.wsid.length > 20) {
            throw new Error(`Workspace ID value '${this.wsid}' is invalid`);
        } else if (
            !this.api_key ||
            this.api_key.length < 25 ||
            this.api_key.length > 60
        ) {
            throw new Error(`API Key value '${this.api_key}' is invalid`);
        } else if (!["dev", "prod"].includes(`${this.env}`)) {
            throw new Error(
                `Environment value '${this.env}' is invalid. It should be either 'prod' or 'dev'.`
            );
        }
    }

    fire = async (event, payload) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `${this.api_url}/event`,
                    { event, ...payload },
                    this.headers
                )
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
    Fyno,
};
