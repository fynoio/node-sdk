const axios = require("axios");

class Profile {
    constructor(endpoint, headers, distinct_id, payload) {
        // User profile trigger API endpoint is prepared
        this.distinct_id = distinct_id;
        this.endpoint = new URL("profiles/", endpoint).href;
        this.payload = { distinct_id, ...payload };
        this.headers = headers;
    }

    async updateProfile() {
        try {
            const url = new URL(`${this.endpoint}/${this.distinct_id}`).href;
            const res = this.request(url, this.payload, "PUT");
            return res;
        } catch (error) {
            if (error.response.status === 400) {
                return this.createProfile(this.distinct_id);
            } else {
                throw new Error(`Error while creating profile`);
            }
        }
    }

    async createProfile() {
        try {
            return this.request(this.endpoint, this.payload);
        } catch (error) {
            throw new Error(`Error while creating profile`);
        }
    }

    async mergeProfiles(new_distinct_id) {
        try {
            const url = new URL(
                `${this.endpoint}/${this.distinct_id}/merge/${new_distinct_id}`
            ).href;
            this.distinct_id = new_distinct_id;
            return this.request(url);
        } catch (error) {
            throw new Error(`Error while updating profile`);
        }
    }

    async addChannelData(channel_name, channel_data) {
        try {
            const url = new URL(`${this.endpoint}/${this.distinct_id}/channel`)
                .href;
            const _channel_object = {
                channel: {},
            };
            switch (channel_name) {
                case "push":
                    _channel_object.channel.push = [
                        {
                            token: channel_data.token,
                            status: 1,
                            integration_id: channel_data.integration,
                        },
                    ];
                    break;
                case "inapp":
                    _channel_object.channel.inapp = [
                        {
                            token: channel_data.token,
                            status: 1,
                            integration_id: channel_data.integration,
                        },
                    ];
                    break;
                case "sms":
                    _channel_object.channel.sms = channel_data.token;
                    break;
                case "whatsapp":
                    _channel_object.channel.whatsapp = channel_data.token;
                    break;
                case "slack":
                    _channel_object.channel.slack = channel_data.token;
                    break;
                case "teams":
                    _channel_object.channel.teams = channel_data.token;
                    break;
                case "email":
                    _channel_object.channel.email = channel_data.token;
                    break;
                case "discord":
                    _channel_object.channel.discord = channel_data.token;
                    break;
                default:
                    throw new Error(
                        `Invalid channel: '${channel_name}' dose not exist.`
                    );
                    break;
            }
            return this.request(url, _channel_object, "PATCH");
        } catch (error) {
            throw new Error(`Unable to add channel`);
        }
    }

    async ClearChannelData(channel_name, token) {
        try {
            const url = new URL(
                `${this.endpoint}/${this.distinct_id}/channel/delete`
            ).href;
            const _channel_object = {};
            if (Array.isArray(channel_name)) {
                _channel_object.channel = [...channel_name];
            } else {
                switch (channel_name) {
                    case "push":
                        _channel_object.push = [token];
                        break;
                    case "inapp":
                        _channel_object.inapp = [token];
                        break;
                    default:
                        _channel_object.channel = [channel_name];
                }
            }
            return this.request(url, _channel_object, "POST");
        } catch (error) {
            throw new Error(`Unable to clear channel`);
        }
    }

    request = async (url, payload = null, method = "POST") => {
        return await axios({
            method,
            url,
            data: payload,
            headers: this.headers,
        });
    };
}
module.exports = Profile;
