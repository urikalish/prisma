/**
 * Created by bennun on 13/08/2017.
 */

import PrismAgent from "./agentTest";
import Controller from "./controllerTest";


console.log(!!PrismAgent);
let controller = new Controller();
controller.createControllerView();

function generateSessionId() {
  let today = new Date();
  let curMonth = today.getUTCMonth() + 1;
  let sessionId = today.getUTCFullYear();
  if (curMonth < 10) {
    sessionId += '0' + curMonth;
  } else {
    sessionId += '' + curMonth;
  }
  if (today.getUTCDate() < 10) {
    sessionId += '0' + today.getUTCDate();
  } else {
    sessionId += '' + today.getUTCDate();
  }
  
  let arr = new Uint32Array(3);
  
  // window.crypto = window.crypto || window.msCrypto;
  
  window.crypto.getRandomValues(arr);
  sessionId += '_' + arr.join('_');
  
  console.log(sessionId);
  return sessionId;
}

function sessionId(uniqueFactor = 3) {
  let ret = Date.now();
  
  for (let i = 0; i < uniqueFactor; i++) {
    ret += '_' + Math.ceil(Math.random() * Math.pow(10, 10));
  }
  
  return ret;
}

console.log(sessionId());
generateSessionId();

// let ignoreClasses = ['selected', 'cursor-readonly', 'active-card', 'is-focused'];

// Make HTTP request to CT for getting a token
// let url = 'https://msgalb002tex.saas.hpe.com/rest-ext/oauth2/token/authorizeUsingCredentials';
// let data = 'scope=tenantid:324444016 permission:prisma.agent&client_id=oauth2-jXemiF65O4YhdVVuUA4z@hpe.com&client_secret=5huCgNdFTT8C03dVnF73';

// let headers = new Headers();
// headers.append('Content-Type', 'application/x-www-form-urlencoded');

// let req = {
//   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//   method: 'POST',
//   credentials: 'include',
//   body: data
// };
//
// fetch(url, req)
//   .then((res) => {
//     return res.blob();
//   })
//   .then((resBlob) => {
//     console.log(resBlob);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// console.log();