var database = firebase.database();
var ref = firebase.database().ref();
getId();
var content = document.querySelector("h2");
var a = content;
var buttShow = document.querySelector(".showList");
var buttDelete = document.querySelector(".buttonDel");
var buttSaveList = document.querySelector(".saveList");

buttSaveList.addEventListener("click", ButtonSaveList);
buttSaveList.addEventListener("touchend", ButtonSaveList);

buttShow.addEventListener("click", ButtonSwowList);
buttShow.addEventListener("touchend", ButtonSwowList);

// функция генерации списка сохраненных данных из фейрбейс
function generateList(obj) {
  var butnDel = document.querySelector(".buttonDel");
  var divList = document.querySelector(".divList");
  var checkButtonAdd = document.querySelector(".addButton");
  var butnAdd = document.createElement("button");
  butnAdd.classList.add("addButton");
  butnAdd.innerHTML = "Add";
  for (var key in obj) {
    var div = document.createElement("div");
    var butnClone = butnDel.cloneNode(false);
    var edit = document.createElement("button");
    var butOk = document.createElement("button");
    butOk.classList.add("buttonOk");
    butOk.classList.add("hidden");
    butOk.innerHTML = "OK";
    edit.classList.add("buttonEdit");
    edit.innerHTML = "Edit";
    butnClone.classList.remove("hidden");
    butnClone.innerHTML = "Delete";
    div.classList.add("formedDiv");
    div.innerHTML = ` Name: <span>${key}</span> <br>
     Login:  <span>${obj[key].login}</span><br>
     Password:<span>${obj[key].password}</span><br>`;
    divList.appendChild(div);
    div.appendChild(edit);
    div.appendChild(butnClone);
    div.appendChild(butOk);
  }
  if (checkButtonAdd) {
    checkButtonAdd.remove(checkButtonAdd);
    divList.appendChild(butnAdd);
  } else {
    divList.appendChild(butnAdd);
  }
}
// функция добавления обработчика к кнопкам
function butAddListener() {
  let divsList = document.querySelector(".divList");
  let formedDivs = document.querySelectorAll(".formedDiv");
  var butnDel = divsList.querySelectorAll(".buttonDel");
  var butnEdit = document.querySelectorAll(".buttonEdit");
  var butnAdd = document.querySelector(".addButton");
  var butOkList = document.querySelectorAll(".buttonOk");

  for (var i = 0; i < formedDivs.length; i++) {
    butnDel[i].addEventListener("click", function(event) {
      this.parentNode.remove(this.parentElement);
    });
    butnDel[i].addEventListener("touchend", function(event) {
      this.parentNode.remove(this.parentElement);
    });
    butnEdit[i].addEventListener("click", ButtonEdit);
    butnEdit[i].addEventListener("touchend", ButtonEdit);

    butOkList[i].addEventListener("click", ButtonOk);
    butOkList[i].addEventListener("touchend", ButtonOk);
  }
  butnAdd.addEventListener("click", ButtonAdd);
  butnAdd.addEventListener("touchend", ButtonAdd);
}
// функции обработчиков кнопок
function ButtonSaveList() {
  var names = document.querySelectorAll(".formedDiv");
  var namesArr = [];
  var loginArr = [];
  var passArr = [];
  var id = content.innerHTML;
  var confirmText = document.querySelector("p");
  for (var i = 0; i < names.length; i++) {
    namesArr[i] = names[i].firstElementChild.innerHTML;
    loginArr[i] = names[i].children[2].innerHTML;
    passArr[i] = names[i].children[4].innerHTML;
  }
  var userListRef = firebase.database().ref(`users/${id}`);
  userListRef.set(null);
  for (var i = 0; i < names.length; i++) {
    if (namesArr[i] && loginArr[i] && passArr[i]) {
      var userListRef = firebase.database().ref(`users/${id}/${namesArr[i]}`);
      userListRef.set({
        login: loginArr[i],
        password: passArr[i]
      });
    } else {
    }
  }
  confirmText.innerHTML = "Data Updates";
}

function ButtonSwowList() {
  var id = content.innerHTML;
  var check = document.querySelector(".formedDiv");
  var userInfo;
  var usersRef = firebase.database().ref(`users/${id}`);
  var confirmText = document.querySelector("p");
  confirmText.innerHTML = "";
  if (check) {
  } else {
    usersRef.on(
      "value",
      function(snapshot) {
        userInfo = snapshot.val();
      },
      function(error) {
        console.log("Error: " + error.code);
      }
    );
    generateList(userInfo);
    butAddListener();
  }
}

function ButtonEdit() {
  var arrayItem = this.parentElement.querySelectorAll("span");
  var arrayItemBuffer = [];
  var del = this.parentElement.querySelector(".buttonDel");
  var butOk = this.parentElement.querySelector(".buttonOk");
  del.classList.add("hidden");
  var edit = this.parentElement.querySelector(".buttonEdit");
  edit.classList.add("hidden");
  butOk.classList.remove("hidden");
  for (var i = 0; i < arrayItem.length; i++) {
    arrayItemBuffer[i] = arrayItem[i].innerHTML;
  }
  for (var i = 0; i < arrayItem.length; i++) {
    arrayItem[i].innerHTML = "";
    var input = document.createElement("input");
    input.type = "text";
    input.value = arrayItemBuffer[i];
    arrayItem[i].appendChild(input);
  }
}

function ButtonOk() {
  var arrayEdit = this.parentElement.querySelectorAll("input");
  var spanConfirm = this.parentElement.querySelectorAll("span");
  var arrayEditBuffer = [];
  var del = this.parentElement.querySelector(".buttonDel");
  var edit = this.parentElement.querySelector(".buttonEdit");
  var butOk = this.parentElement.querySelector(".buttonOk");
  for (var i = 0; i < arrayEdit.length; i++) {
    arrayEditBuffer[i] = arrayEdit[i].value;
    spanConfirm[i].innerHTML = arrayEditBuffer[i];
  }
  del.classList.remove("hidden");
  edit.classList.remove("hidden");
  buttSaveList.classList.remove("hidden");
  butOk.classList.add("hidden");
}

function ButtonAdd() {
  var butnAdd = document.querySelector(".addButton");
  var butn = document.querySelector(".buttonDel");
  var divList = document.querySelector(".divList");
  var divs = document.createElement("div");
  var butnClone = butn.cloneNode(false);
  var edits = document.createElement("button");
  var butOk = document.createElement("button");
  butOk.classList.add("buttonOk");
  butOk.classList.add("hidden");
  butOk.innerHTML = "OK";
  edits.classList.add("buttonEdit");
  edits.innerHTML = "Edit";
  butnClone.classList.remove("hidden");
  butnClone.innerHTML = "Delete";
  divs.classList.add("formedDiv");
  divs.innerHTML = ` Name: <span></span> <br> Login:<span></span><br>Password:<span></span><br>`;
  divList.insertBefore(divs, butnAdd);
  divs.appendChild(edits);
  divs.appendChild(butnClone);
  divs.appendChild(butOk);
  addEventToNewItem();
}
// функция добавления новых елементов для кнопки адд
function addEventToNewItem() {
  let divsList = document.querySelectorAll(".formedDiv");
  var lastItem = divsList[divsList.length - 1];
  var butnEdit = lastItem.querySelector(".buttonEdit");
  var butnDel = lastItem.querySelector(".buttonDel");
  var butOkList = lastItem.querySelector(".buttonOk");
  butnDel.addEventListener("click", function(event) {
    this.parentNode.remove(this.parentElement);
  });
  butnEdit.addEventListener("click", ButtonEdit);
  butnEdit.addEventListener("touchend", ButtonEdit);

  butOkList.addEventListener("click", ButtonOk);
  butOkList.addEventListener("touchend", ButtonOk);
}

// функция генерации данных
function generate() {
  let fromId = content.innerHTML;
  var usersRef = database.ref(`users/${fromId}/`);
  usersRef.orderByKey().on("child_added", function(data) {});
}
generate();

// функия для отправки запроса для получения айди пользователя
function getId() {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "/id");
  xhr.onload = function() {
    var id = this.responseText;
    generateHTML(id);
  };
  xhr.send();
}

function generateHTML(message) {
  content.innerHTML = message;
}
