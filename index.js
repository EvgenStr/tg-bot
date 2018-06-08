var TelegramBot = require("node-telegram-bot-api");

var admin = require("firebase-admin");
var serviceAccount = require("./test-db-c9cf0-firebase-adminsdk-zrniv-75f7dc42cd.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-db-c9cf0.firebaseio.com"
});
// express
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
// const path = require("path");
var router = express.Router();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Устанавливаем токен, который выдавал нам бот.
var token = "";
// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

// +++++++++++++++++++++++++++++++++++
bot.onText(/\/test/, function(msg) {
  var fromId = msg.from.id;
  var resp = "Your id: ";
  bot.sendMessage(fromId, resp + fromId);
});
// ++++++++++++++++++++++++++++++++++++++++++
bot.onText(/\/cat/, function(msg) {
  var chatId = msg.chat.id;
  // Фотография может быть: путь к файлу, поток(stream) или параметр file_id
  var photo = "./cats.png";
  bot.sendPhoto(chatId, photo, { caption: "Ваш кот ^_^  <3" });
});

bot.onText(/\/add (.+) (.+) (.+)/, function(msg, match) {
  var fromId = msg.from.id;
  var name = match[1];
  var login = match[2];
  var pass = match[3];
  var resp = "Добавлен логин и пароль для ";
  bot.sendMessage(fromId, resp + name);
  // console.log("add");
  var userListRef = admin.database().ref(`users/${fromId}/${name}`);
  // var newUserRef = userListRef.push();  /* тут нужно подумать как сделать, может быть неколько акк для сайта, или сделать сет что-бы он перезаписывал  */
  // newUserRef.set({
  userListRef.set({
    login: login,
    password: pass
  });
  var path = newUserRef.toString();
});

//показывает список сайтов для которых сохранены пароль и логин
bot.onText(/\/getlist/, function(msg) {
  let fromId = msg.from.id;
  var usersRef = admin.database().ref(`users/${fromId}`);
  usersRef.orderByKey().on("child_added", function(data) {
    console.log(data.key);
    bot.sendMessage(fromId, data.key);
  });
});

//показывает для конкретного выбранного сайта
bot.onText(/\/getfrom (.+)/, function(msg, match) {
  let fromId = msg.from.id;
  var siteKey = match[1];
  var usersRef = admin.database().ref(`users/${fromId}/${siteKey}/`);

  usersRef.orderByValue().on("value", function(data) {
    data.forEach(function(data) {
      console.log(data.key + " : " + data.val());
      bot.sendMessage(fromId, data.key + " : " + data.val());
    });
  });
});
// експресс +++++++++++++++++++++++++++++++++++
// app.get("/", function(req, res) {
//   res.send("Hello World!");
// });

bot.onText(/\/link/, function(msg) {
  var fromId = msg.from.id;
  var key = Math.ceil(99 + Math.random() * 1000);
  // var linkHtml = `http://localhost:3000/${fromId+key}`;
  var html2 = `<a href="https://evgenstr.herokuapp.com/${fromId +
    key}">your link</a>`;
  console.log(html2);
  let timer = 0;
  let timerId = setInterval(function() {
    timer++;
  }, 600000);
  setTimeout(function() {
    clearInterval(timerId);
  }, 700000);

  app.get(`/${fromId + key}`, function(req, res) {
    if (timer < 1) {
      res.sendFile("public/index.html", { root: __dirname });
    } else {
      res.send("Время вышло");
    }
  });

  app.get("/id", (req, res) => {
    res.send(JSON.stringify(fromId));
  });

  console.log(timer);
  bot.sendMessage(fromId, html2, { parse_mode: "HTML" });
});

app.listen(process.env.PORT || 3000, function() {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

console.log(
  "++++++++++++++++++++++++" +
    "\n" +
    "App start" +
    "\n" +
    "++++++++++++++++++++++++"
);

// function dataList() {
//   var arr = [];
//   var usersRef = admin.database().ref(`users/${fromId}`);
//   usersRef.orderByKey().on("child_added", function(data) {
//     arr.push(data.key);
//   });
//   console.log(arr);
//   // return arr;
//   var html = "";
//   for (var i = 0; i < arr.length; i++) {
//     html += `<h1>${arr[i]}</h1>`;
//   }
//   return html;
// }
// dataList();
