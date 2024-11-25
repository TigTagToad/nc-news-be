const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
/* Set up your beforeEach & afterAll functions here */
afterAll(() => {
  console.log("all test have run");
  return db.end();
});
beforeEach(() => {
  return seed(data);
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/articles/:article_id", ()=>{
  test("200: Responds with an object with relevent id", ()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response)=>{
      expect(response.body).toMatchObject({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
      )
    })

  });
  test("400: Responds with bad request when not valid id is used", ()=>{
    return request(app)
    .get("/api/articles/44")
    .expect(400)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("bad request")
    })
  })

});