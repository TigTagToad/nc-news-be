const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");
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
  test("404: Responds with not found when non existant id is used", ()=>{
    return request(app)
    .get("/api/articles/44")
    .expect(404)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("not an id number")
    })
  }),
  test("400: responds with bad request when invalid id is used ", ()=>{
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("bad request")
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
    test("404: doesnt post comment when article id non existant", ()=>{
      const newComment = {body: "new comment", author: "lurker"}
      return request(app)
      .post("/api/articles/44/comments")
      .send(newComment)
      .expect(404)
      .then(({body: {msg}})=>{
        expect(msg).toBe("not an id number")

      })
    }),
    test("400: doesnt post comment when invalid article id", ()=>{
      const newComment = {body: "new comment", author: "lurker"}
      return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({body: {msg}})=>{
        expect(msg).toBe("bad request")

    })
  }),
  test("400: does post when comment has missing fields", ()=>{
    const newComment = {body: "new comment"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body: {msg}})=>{
      expect(msg).toBe("bad request")
  })}),
  test("400: doesnt post comment when username doesnt exist",()=>{
    const newComment = {body: "new comment", username: "taiga"}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body: {msg}})=>{
      expect(msg).toBe("bad request")
  })
  })
});

  describe("PATCH /api/articles/:article_id", ()=>{
    test("200: succesfully patches article via article id", ()=>{
      const patchReq = { inc_votes: 1 }
      return request(app)
      .patch("/api/articles/1")
      .send(patchReq)
      .expect(200)
      .then(({body: {article}})=>{
          expect(article.votes).toBe(101)
      })
    }),
    test("404: doesnt update article when non existant article id", ()=>{
      const patchReq = { inc_votes: 1 }
      return request(app)
      .patch("/api/articles/44")
      .send(patchReq)
      .expect(404)
      .then(({body: {msg}})=>{
          expect(msg).toBe("not an id number")
      })
    }),
    test("400: doesnt update article when invalid article id", ()=>{
      const patchReq = { inc_votes: 1 }
      return request(app)
      .patch("/api/articles/banana")
      .send(patchReq)
      .expect(400)
      .then(({body: {msg}})=>{
          expect(msg).toBe("bad request")
      })
    }),
    test("400: doesnt update when invalid body", ()=>{
      const patchReq = { inc_votes: "banana"}
      return request(app)
      .patch("/api/articles/1")
      .send(patchReq)
      .expect(400)
      .then(({body: {msg}})=>{
          expect(msg).toBe("bad request")
      })
    })
  });

  describe("DELETE /api/comments/:comment_id", ()=>{
    test("200: succesfully deletes comment by id", ()=>{

      return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response)=>{
          //console.log(response.body)
          expect(response.body).toEqual({})
      })
  }),
  test("404: doest delete when invalid id", ()=>{
      return request(app)
      .delete("/api/comments/44")
      .expect(404)
      .then((body)=>{
         //console.log(body.body)
          expect(body.body.msg).toBe("not found")
          
      })
  }),
  test("400: doest delete when invalid id", ()=>{
    return request(app)
    .delete("/api/comments/banana")
    .expect(400)
    .then((body)=>{
        
        expect(body.body.msg).toBe("bad request")
        
    })
})
  });

  describe("GET /api/users", ()=>{
    test("200: successfully returns users", ()=>{

      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body: {users}})=>{
        expect(users.length).toBe(4)
        users.forEach((user)=>{
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
           })
      })
  
      })
    })

    });

    describe("GET /api/articles sortting queries",()=>
    {
      test("200: succesfully returns sorted array of articles by any valid column", ()=>{
        return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({body : {articles}})=>{
          expect(articles).toBeSortedBy('title')
        })
      }),
      test("400: doesnt retun an array when invalid sortby", ()=>{
        return request(app)
        .get("/api/articles?sort_by=banana&order=asc")
        .expect(400)
        .then(({body : {msg}})=>{
          expect(msg).toBe('bad request')
        })
      }),
      test("400: doesnt retun an array when invalid order", ()=>{
        return request(app)
        .get("/api/articles?sort_by=created_by&order=banana")
        .expect(400)
        .then(({body : {msg}})=>{
          expect(msg).toBe('bad request')
        })
      }),
      test("200: returns array when just order is inputed", ()=>{
        return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({body : {articles}})=>{
          expect(articles).toBeSortedBy('created_at')
        })
      })
    })

    describe("GET /api/articles (topic query)",()=>{
      test("200: successfully returns filterd array by topic",()=>{
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body: {articles}})=>{
          expect(articles.length).toBe(12)
          articles.forEach((article)=>{
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String)
            })
          })
        })
      }),
      test("404: topic not found", ()=>{
        return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({body:{msg}})=>{
          expect(msg).toBe("not found")
        })
      }),
      test("200: succesfully returns empty array when valid topic is queried but not used in articles",()=>{
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body:{articles}})=>{
          expect(articles).toEqual([])
        })
      })
    });

    describe("GET /api/articles/:article_id with comment_count", ()=>{
      //I've not tested for invalid and non existant ids as they are tested above in the original test for get article by article_id
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
            comment_count: "11"
          }
          )
        })
    
      })
    
    });