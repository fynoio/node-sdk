const { Event } = require("./Event");

class Fyno {
    wsid = process.env.FYNO_WSID;
    api_key = process.env.FYNO_API_KEY;
    version = process.env.FYNO_VERSION || "live";
    endpoint = process.env.FYNO_ENDPOINT || "https://api.fyno.io/v1/";

    constructor(
        wsid = this.wsid,
        api_key = this.api_key,
        version = this.version,
        endpoint = this.endpoint
    ) {
        this.wsid = wsid;
        this.api_key = api_key;
        this.version = version;
        // WSID and VERSION values get appended to the endpoint
        this.endpoint = new URL(`${this.wsid}/${this.version}`, endpoint).href;
        this.headers = this.getHeaders();

        this.validate();
    }

    getHeaders() {
        return {
            Authorization: `Bearer ${this.api_key}`,
            "Content-Type": "application/json",
        };
    }

    validate() {
        // the validation checks if the provided WSID, API Key, and Version values are correct
        if (!this.wsid || this.wsid.length < 10 || this.wsid.length > 20) {
            throw new Error(`Workspace ID value '${this.wsid}' is invalid`);
        } else if (
            !this.api_key ||
            this.api_key.length < 25 ||
            this.api_key.length > 60
        ) {
            throw new Error(`API Key value '${this.api_key}' is invalid`);
        } else if (!["test", "live"].includes(`${this.version}`)) {
            throw new Error(
                `Environment value '${this.version}' is invalid. It should be either 'test' or 'live'.`
            );
        }
    }

    async fire(event, payload) {
        // this function fires the event
        const _event = new Event(this.endpoint, this.headers, event, payload);
        return _event.trigger();
    }
}

module.exports = {
    Fyno,
};
