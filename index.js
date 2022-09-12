require("dotenv").config();
const app = require("express")();
const OpenTok = require("opentok");
const OT = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

app.get("/", function (request, response) {
  console.log("Get request to /");
  response.sendFile(__dirname + "/src/app/app.component.html");
});

app.get("/session/:name", function (request, response) {
  console.log("Get request to /session/" + request.params.name);
  response.sendFile(__dirname + "/src/app/session.html");
});

let sessions = {};

app.post("/session/:name", function (request, response) {
  const name = request.params.name;

  if (sessions[name]) {
    const token = OT.generateToken(sessions[name], {
      role: "publisher",
      data: "roomname=" + name,
    });

    response.send({
      sessionId: sessions[name],
      apiKey: process.env.API_KEY,
      token: token,
    });
  } else {
    OT.createSession(function (error, session) {
      if (error) {
        console.log(error);
      }
      sessions[name] = session.sessionId;

      const token = OT.generateToken(sessions[name], {
        role: "publisher",
        data: "roomname=" + name,
      });

      response.send(
        JSON.stringify({
          sessionId: sessions[name],
          apiKey: process.env.API_KEY,
          token: token,
        })
      );
    });
  }
});

app.listen(3000, function () {
  console.log("Everything is going well!");
});
