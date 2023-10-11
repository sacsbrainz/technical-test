import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";
import app from "../src/app";
import casual from "casual";

chai.use(chaiHttp);
const expect = chai.expect;
let token: string;

describe("User Registration and Login", () => {
  const userData = {
    email: casual.email,
    password: casual.password,
  };

  describe("POST /register", () => {
    it("it should register a user", (done) => {
      chai
        .request(app)
        .post("/api/auth/register")
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("message")
            .eql("User registered successfully, Kindly check your email.");
          done();
        });
    });

    it("it should return an error if the user already exists", (done) => {
      chai
        .request(app)
        .post("/api/auth/register")
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").eql("User already exists");
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("it should login a user", (done) => {
      chai
        .request(app)
        .post("/api/auth/login")
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("it should return an error for an incorrect password", (done) => {
      chai
        .request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: casual.password,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body)
            .to.have.property("error")
            .eql("Authentication failed");
          done();
        });
    });

    it("it should return an error for a non-existent user", (done) => {
      chai
        .request(app)
        .post("/api/auth/login")
        .send({ email: casual.email, password: casual.password })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error").eql("Account not found");
          done();
        });
    });
  });
});
