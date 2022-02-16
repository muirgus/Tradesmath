"use strict";

const WHITE_LIST = [
  "http://localhost:4200",
  "http://localhost:4200/",
  "http://174.138.115.13:8080",
  "https://174.138.115.13:8080/",
  "https://welders-math.web.app",
  "http://welders-math.web.app",
  "https://demoapi.mycodelibraries.com/",
  "http://174.138.115.13:5000",
  "https://174.138.115.13:5000/",
  "https://welders-math.firebaseapp.com/",
  "https://welders-math.firebaseapp.com",
  "https://welders-math.web.app/",
];

module.exports = {
  // list of domaines have access
  WHITE_LIST: WHITE_LIST,

  // status codes
  SUCCESS_CODE: 200,
  ALLREADY_EXIST: 409,
  CREATED: 201,
  ERROR_CODE: 400,
  AUTH_CODE: 401,
  SERVICE_UNAVAILABLE: 503,
  NO_CONTENT: 204,
};
