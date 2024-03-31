const https = require("https");

const codeInfo = {};
codeInfo[200] = "OK          :";
codeInfo[202] = "Accepted    :Received but not yet acted upon";
codeInfo[204] = "No Content  :No response expected";
codeInfo[404] = "Not Found   :";
codeInfo[409] = "Conflict    :";
codeInfo[500] = "Server Error:";
codeInfo[503] = "Service Unavailable:";
codeInfo[504] = "Gateway Timeout:";
codeInfo[505] = "HTTP Version Not Supported:";
codeInfo[507] = "Insufficient Storage:";
codeInfo[502] = "Bad Gateway:";

class Login {
  constructor() {
    this.userName = "";
    this.password = "";
    this.hostName = "keyless.rentlyorange.com"; // test
    this.token = "";
    this.isRequestSent = false;
  }

  getErrorMessage(code) {
    return codeInfo[code] || "";
  }

  setUserName(userName) {
    this.userName = userName;
  }

  setPassword(password) {
    this.password = password;
  }

  getAccessToken(cb) {
    const opts = {
      path: "/api/admin_users",
      postdata: { password: this.password, username: this.userName },
      headers: {
        "Content-Type": "application/json",
        "Content-Length": 81,
      },
      hostname: this.hostName,
      port: 443,
      method: "POST",
    };
    console.log("getAccessToken opts:", opts);
    this.isRequestSent = true;
    const req = https.request(opts, function (res) {
      const code = res.statusCode;
      let info = codeInfo[code] || "";
      info = code + ":" + info;
      if (code == 204) {
        console.log("getAccessToken 204");
        cb(false, "OK:" + info);
        return;
      } else if (code >= 400 && code < 499) {
        console.log("getAccessToken 400");
        cb({ code: code, info: info });
        return;
      }
      let data = "";

      res.on("data", function (d) {
        data += d;
      });
      res.on("end", function () {
        const r = false;
        try {
          r = JSON.parse(data);
        } catch (e) {
          console.log("getAccessToken json parse error:", e);
          cb({ code: code, info: info });
          return;
        }
        this.token = r.token;
        cb(false, r);
        return;
      });
    });
    req.on("error", function (e) {
      console.log("getAccessToken error:", e);
      cb({ code: code, info: info });
      return;
    });
    req.end();
  }
}

module.exports = new Login();
