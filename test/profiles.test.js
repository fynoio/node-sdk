const { Fyno } = require("../src");
const axios = require("axios");

const success_response = {
    create: {
        status: "ok",
        _message: "Profile created successfully",
    },
    update: {
        status: "ok",
        _message: "1 Record(s) updated successfully",
    },
    channel_del: {
        status: "ok",
        _message: "Channel has been modified successfully",
    },
};

const failure_response = {
    api: {
        status: "error",
        _message: "Invalid API details",
    },
    channel_del: {
        status: "error",
        _message: "Unable to delete channel since the channel does not exist",
    },
};

describe("Creating user profile", () => {
    test("Should create a profile", async () => {
        const fyno = new Fyno();
        const profile = await fyno.identify("testcases");
        const response = await profile.create();
        expect(response.status).toBe(201);
    });
    test("Should update profile with channel data", async () => {
        const fyno = new Fyno();
        await fyno.identify("testcases");
        const response = await fyno.setWhatsapp("+919000504436");
        expect(response.data).toMatchObject(success_response.update);
    });
    test("Should delete channel against profile", async () => {
        const fyno = new Fyno();
        await fyno.identify("testcases");
        const response = await fyno.clearChannel("whatsapp", "+919000504436");
        expect(response.data).toMatchObject(success_response.channel_del);
    });
    test("Should throw an error as channel passed is not available", async () => {
        const fyno = new Fyno();
        await fyno.identify("testcases");
        try {
            const response = await fyno.clearChannel("sms");
        } catch (error) {
            expect(error.response.data).toMatchObject(
                failure_response.channel_del
            );
        }
    });

    afterAll(async () => {
        const fyno = new Fyno();

        const options = {
            method: "POST",
            url: `${fyno.endpoint}profiles/delete`,
            headers: fyno.headers,
            data: { distinct_id: ["testcases"] },
        };

        await axios.request(options);
    });
});
