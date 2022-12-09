const { Fyno } = require("../src");
const moment = require("moment");

const to = {
    sms: "",
    whatsapp: "",
    email: "",
    slack: "ashwin@fyno.io",
    discord: "",
    teams: "",
    push: "",
};

const data = {
    name: "Ashwin",
    sdk: "Node.js",
};

const event_name = "test-cases";

const success_response = {
    request_id: expect.anything(),
    event: event_name,
    response: {
        sms: {
            status: "error",
            message: expect.anything(),
        },
        whatsapp: {
            status: "error",
            message: expect.anything(),
        },
        email: {
            status: "error",
            message: expect.anything(),
        },
        slack: {
            status: "ok",
            destination: to.slack,
            msg_id: expect.anything(),
        },
        discord: {
            status: "error",
            message: expect.anything(),
        },
        teams: {
            status: "error",
            message: expect.anything(),
        },
        push: {
            status: "error",
            message: expect.anything(),
        },
    },
};

const failure_response = {
    status: "error",
    _message: "Invalid API details",
};

describe("Firing an event should", () => {
    test("Fail when WSID supplied is incorrect", async () => {
        let response;

        try {
            const fyno = new Fyno("12345678910");
            response = await fyno.fire(event_name, { to, data });
        } catch (e) {
            response = e;
        }

        expect(response).toMatchObject(failure_response);
    });
    test("Fail when WSID supplied is invalid", async () => {
        let response;

        try {
            const fyno = new Fyno("12345");
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(`Workspace ID value '12345' is invalid`);
    });
    test("Fail when API Key supplied is incorrect", async () => {
        let response;

        try {
            const fyno = new Fyno(
                (wsid = undefined),
                (api_key = "ABCDEFG.++HIJKLMNOPQRSTUVWXYZ012345678910")
            );
            response = await fyno.fire("event_name", { to, data });
        } catch (e) {
            response = e;
        }

        expect(response).toMatchObject(failure_response);
    });
    test("Fail when API Key supplied is invalid", async () => {
        let response;

        try {
            const fyno = new Fyno((wsid = undefined), (api_key = "12345"));
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(`API Key value '12345' is invalid`);
    });
    test("Fail when ENV supplied is invalid", async () => {
        let response;
        try {
            const fyno = new Fyno(undefined, undefined, "random");
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(
            `Environment value 'random' is invalid. It should be either 'prod' or 'dev'.`
        );
    });
    test("Work when all credentials are correct and supplied through ENV file", async () => {
        const fyno = new Fyno();
        const unix_time = moment().valueOf();
        const response = await fyno.fire(event_name, { to, data });

        expect(response.received_time).toBeGreaterThanOrEqual(unix_time);
        expect(response).toMatchObject(success_response);
    });
    test("Work when all credentials are correct and supplied manually", async () => {
        const fyno = new Fyno(
            process.env.FYNO_WSID,
            process.env.FYNO_API_KEY,
            process.env.FYNO_ENV
        );
        const unix_time = moment().valueOf();
        const response = await fyno.fire(event_name, { to, data });

        expect(response.received_time).toBeGreaterThanOrEqual(unix_time);
        expect(response).toMatchObject(success_response);
    });
    test("Work when all credentals are correct and supplied manually and through ENV files", async () => {
        const fyno = new Fyno(process.env.FYNO_WSID);
        const unix_time = moment().valueOf();
        const response = await fyno.fire(event_name, { to, data });

        expect(response.received_time).toBeGreaterThanOrEqual(unix_time);
        expect(response).toMatchObject(success_response);
    });
});
