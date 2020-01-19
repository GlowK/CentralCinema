const request = require("supertest");
const app = require("../../app");
const newUser = require("../mock-data/new-user.json");

const endpointUrl = "/superusers/";

describe(endpointUrl, () =>{
    it("POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.firstName).toBe(newUser.firstName);
        expect(response.body.lastName).toBe(newUser.lastName);
    });
});