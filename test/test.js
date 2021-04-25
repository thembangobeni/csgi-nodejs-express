const request = require("supertest");
const app = require("../src/index.ts");

    describe("GET /", () => {
      it("respond with Server is up..", (done) => {
        request(app).get("/").expect('"Server is up.."', done);
      })
    });