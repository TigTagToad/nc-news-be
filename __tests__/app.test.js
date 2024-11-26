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
      expect(response.body.article).toMatchObject({
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
    .expect(404)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("not an id number")
    })
  })

});

describe("GET /api/topics", ()=>{
  test("200: responds with an array topic of objects each containing the properties: slug and description", ()=>{
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response)=>{

        response.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String)
          })
          
        });

      })
  })
});

describe("GET /api/articles", ()=>{

  test("200: array is in descending order by created at", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response)=>{
        //console.log(response.body.articles)
        expect(response.body.articles).toBeSortedBy('created_at',{
            descending: true
        })
      })
    }),
    test("200: responds with an array of articles with correct properties in each object", ()=>{
      return request(app)
      .get("/api/articles")
      .then((response)=>{
        expect(response.body.articles.length).toBe(13)
      response.body.articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
           })
      })

      })
    })
  })

  describe("GET /api/articles/:article_id/comments", ()=>{
    test("200: responds with an array of comments with correct properties in each object", ()=>{
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body})=>{

        const {comments} = body
        expect(comments.length).toBe(11)
        comments.forEach((comment)=>{
          //console.log(comment)
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at:expect.any(String),
            author:expect.any(String),
            body:expect.any(String),
            article_id:expect.any(Number),
          })
        })
      })

    }),
    test("comments ordered by date", ()=>{
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body})=>{

        const {comments} = body
        expect(comments).toBeSortedBy('created_at',{
          descending: true
      })
      })
    }),
    test("404: NOT FOUND if article id doesnt exist",()=>{
      return request(app)
      .get("/api/articles/44/comments")
      .expect(404)
      .then(({body})=>{

        const {msg} = body
        expect(msg).toBe("not an id number")
      })
    }),
    test("200: empty array if article id has no comments", ()=>{
      return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body})=>{

        const {comments} = body
        expect(comments).toEqual([])
       
      })
    })
  });

  describe("POST /api/articles/:article_id/comments", ()=>{
    test("201: comment successfully posted", ()=>{
      const newComment = {body: "new comment", author: "lurker"}
      return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({body: {comment}})=>{
        expect(comment).toEqual(
          expect.objectContaining({
             body: "new comment",
             author: "lurker",
             votes: 0,
             article_id: 1,
             created_at: expect.any(String)
          })
      )

      })
    }),
    test("404: doesnt post comment when article id not valid", ()=>{
      const newComment = {body: "new comment", author: "lurker"}
      return request(app)
      .post("/api/articles/44/comments")
      .send(newComment)
      .expect(404)
      .then(({body: {msg}})=>{
        expect(msg).toBe("not an id number")

      })
    })
  })
