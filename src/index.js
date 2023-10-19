const { Event } = require("./Event");
const Profile = require("./Profile");

class Fyno {
    wsid = process.env.FYNO_WSID;
    api_key = process.env.FYNO_API_KEY;
    version = process.env.FYNO_VERSION || "live";
    endpoint = process.env.FYNO_ENDPOINT || "https://api.fyno.io/v1/";
    profile = null;

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
        this.endpoint = new URL(`${this.wsid}/${this.version}/`, endpoint).href;
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

    async identify(distinct_id, payload) {
        const profile = new Profile(
            this.endpoint,
            this.headers,
            distinct_id,
            payload
        );
        this.profile = profile;
        return this;
    }

    async getProfile(distinct_id) {
        const profile = new Profile(this.endpoint, this.headers, distinct_id);
        return profile.getProfile();
    }

    async create() {
        return await this.profile.createProfile();
    }

    async update(distinct_id, payload) {
        const profile = new Profile(
            this.endpoint,
            this.headers,
            distinct_id,
            payload
        );
        this.profile = profile;
        return profile.updateProfile();
    }

    async setEmail(token) {
        return await this.profile.addChannelData("slack", { token });
    }

    async setSms(token) {
        return await this.profile.addChannelData("slack", { token });
    }

    async setSlack(token) {
        return await this.profile.addChannelData("slack", { token });
    }

    async setDiscord(token) {
        return await this.profile.addChannelData("discord", { token });
    }

    async setTeams(token) {
        return await this.profile.addChannelData("teams", { token });
    }

    async setWhatsapp(token) {
        return await this.profile.addChannelData("whatsapp", { token });
    }

    async clearChannel(channel, token = null) {
        return await this.profile.ClearChannelData(channel, token);
    }
}

module.exports = {
    Fyno,
};
