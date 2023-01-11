const { Fyno } = require("../src");

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
    received_time: expect.anything(),
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

const success_response_batch = {
    request_id: expect.anything(),
    received_time: expect.anything(),
    event: event_name,
    response: [
        {
            seq: 1,
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
    ],
};

const failure_response = {
    status: "error",
    _message: "Invalid API details",
};

describe("Firing an event", () => {
    test("Should fail when WSID supplied is incorrect", async () => {
        let response;

        try {
            const fyno = new Fyno("12345678910");
            response = await fyno.fire(event_name, { to, data });
        } catch (e) {
            response = e;
        }

        expect(response).toMatchObject(failure_response);
    });
    test("Should fail when WSID supplied is invalid", async () => {
        let response;

        try {
            const fyno = new Fyno("12345");
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(`Workspace ID value '12345' is invalid`);
    });
    test("Should fail when API Key supplied is incorrect", async () => {
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
    test("Should fail when API Key supplied is invalid", async () => {
        let response;

        try {
            const fyno = new Fyno((wsid = undefined), (api_key = "12345"));
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(`API Key value '12345' is invalid`);
    });
    test("Should fail when ENV supplied is invalid (single)", async () => {
        let response;
        try {
            const fyno = new Fyno(undefined, undefined, "random");
        } catch (e) {
            response = e.message;
        }

        expect(response).toBe(
            `Environment value 'random' is invalid. It should be either 'test' or 'live'.`
        );
    });
    test("Should succeed when all credentials are correct and supplied through ENV file (single)", async () => {
        const fyno = new Fyno();
        const response = await fyno.fire(event_name, { to, data });

        expect(response).toMatchObject(success_response);
    });
    test("Should succeed when all credentials are correct and supplied through ENV file (batch)", async () => {
        const fyno = new Fyno();
        const response = await fyno.fire(event_name, [{ to, data }]);

        expect(response).toMatchObject(success_response_batch);
    });
    test("Should succeed when all credentials are correct and supplied manually (single)", async () => {
        const fyno = new Fyno(
            process.env.FYNO_WSID,
            process.env.FYNO_API_KEY,
            process.env.FYNO_VERSION
        );
        const response = await fyno.fire(event_name, { to, data });

        expect(response).toMatchObject(success_response);
    });
    test("Should succeed when all credentials are correct and supplied manually (batch)", async () => {
        const fyno = new Fyno(
            process.env.FYNO_WSID,
            process.env.FYNO_API_KEY,
            process.env.FYNO_VERSION
        );
        const response = await fyno.fire(event_name, [{ to, data }]);

        expect(response).toMatchObject(success_response_batch);
    });
    test("Should succeed when all credentals are correct and supplied manually and through ENV files (single)", async () => {
        const fyno = new Fyno(process.env.FYNO_WSID);
        const response = await fyno.fire(event_name, { to, data });

        expect(response).toMatchObject(success_response);
    });
    test("Should succeed when all credentals are correct and supplied manually and through ENV files (batch)", async () => {
        const fyno = new Fyno(process.env.FYNO_WSID);
        const response = await fyno.fire(event_name, [{ to, data }]);

        expect(response).toMatchObject(success_response_batch);
    });
});
