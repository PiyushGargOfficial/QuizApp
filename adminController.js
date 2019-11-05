//Button Click Attach
window.addEventListener("load", init);

var countDown;
var allStudents = [];

const showHide = () =>
  document.getElementById("sbox").classList.toggle("showHide");

const printCounter = () =>
  (document.querySelector("#id").innerText = countDown.next().value);

function init() {
  countDown = autoGen();
  printCounter();
  updateCount();
  bindEvents();
  showHide();
  showHide2();
  fetchUserName();
  fetchUserMarks();
}

function bindEvents() {
  document
    .getElementById("fetchFromServer")
    .addEventListener("click", fetchFromServer);
  document
    .getElementById("saveToServer")
    .addEventListener("click", saveToServer);
  document.querySelector("#sortBy").addEventListener("change", sortIt);
  document.querySelector("#sort").addEventListener("click", showHide2);
  document.querySelector("#clearAll").addEventListener("click", clearAll);
  document.getElementById("searchValue").addEventListener("Change", searchIt);
  document.querySelector("#search").addEventListener("click", showHide);
  document.getElementById("add").addEventListener("click", addQuestion);
  document.getElementById("delete").addEventListener("click", deleteQuestion);
  document.getElementById("name").addEventListener("keyup", textareaCounter);
  document.getElementById("signOut").addEventListener("click", signOutToLogin);
  document.getElementById("showScoreCard").addEventListener('click', showSC);
  document.getElementById("closeUserDetails").addEventListener('click', closeSC);
}

function closeSC() {
  document.getElementById("userDetails").style.display = "none";
}

async function fetchUserMarks() {
  await firebase.database().ref("/Users/").on("value", snapshot => {
    var allUsers = snapshot.val();
    for (let key in allUsers) {
      let UserObj = allUsers[key];
      allStudents.push(UserObj);
    }
  })

  if (allStudents.length === 0) {
    setTimeout(fillStudents, 5000);
  } else {
    fillStudents();
  }
}

function fillStudents() {

  console.log("inside fill students");

  for (i = 0; i < (allStudents.length - 2); i++) {
    var table = document.querySelector(".userTable");
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.innerText = allStudents[i].Name;
    var td2 = document.createElement("td");
    td2.innerText = allStudents[i].Score;
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  }
}

function showSC() {
  document.getElementById("userDetails").style.display = "block";
}

function signOutToLogin() {
  location.href = "loginPage.html";
}

function fetchUserName() {
  var username = document.getElementById("userID");

  var user = firebase.database().ref("/Users/");
  user.on("value", snapshot => {
    var adminUser = snapshot.val();
    console.log(adminUser.Admin.Name);
    username.innerHTML = adminUser.Admin.Name;
  });
}

function textareaCounter() {
  setInterval(function () {
    var message = document.getElementById("name");
    var text = message.value;
    var textLen = text.length;

    var taCounter = document.getElementById("taCounter");
    taCounter.innerHTML = 250 - textLen + " words left";
    //ask sir how to add color when words are left low
    if (textLen > 250) {
      message.value = message.value.substring(0, 250); //substring cuts the the whole text from 0 to 250 but it only works when attached with value operator.
    }
  }, 100);
}

function updateCount() {
  document.querySelector("#total").innerText =
    questionOperations.questions.length;
  document.querySelector("#mark").innerText = questionOperations.countMark();
  document.querySelector("#unmark").innerText =
    questionOperations.questions.length - questionOperations.countMark();
}

function toggleRed() {
  var id = this.getAttribute("qid");
  console.log("Toggle Red Call", this, "Id is", id);

  var tr = this.parentNode.parentNode;
  tr.classList.toggle("alert-danger");
  questionOperations.toggleMark(id);
  updateCount();
}

function edit() {
  //edit
  var id = this.getAttribute("qid");
  var tr = this.parentNode.parentNode;
  tr.classList.toggle("alert-primary");
}

function createIcon(className, fn, id) {
  var icon = document.createElement("i");
  icon.className = className;

  icon.setAttribute("qid", id);
  icon.addEventListener("click", fn);

  return icon;
}

function searchIt() {
  var key = document.getElementById("searchby").value;
  var val = document.getElementById("searchValue").value;

  if (key != "-1") {
    var subArr = questionOperations.search(key, val);
    printQuestions(subArr);
  }
}

function clearAll() {
  alert("All questions will be removed");
  document.querySelector("#questions").innerHTML = "";
  questionOperations.questions = [];
  //ask sir that we should update the questions array aswell while clearing it all and also at the time of deleting/
  updateCount();
}

function showHide2() {
  document.getElementById("sortBox").classList.toggle("showHide");
}

function sortIt() {
  var value = document.getElementById("sortBy").value;
  if (value != "-1") {
    var questions = questionOperations.sortQues(value);
    printQuestions(questions);
  }
}

function saveToServer() {
  var lastAdded =
    questionOperations.questions[questionOperations.questions.length - 1];
  var id = lastAdded.id;

  var promise = firebase
    .database()
    .ref("/questions/" + id)
    .set(lastAdded); //make a question which has a id and save the questionObject in that id
  promise
    .then(data => {
      alert(" Last Added Record saved in DB");
    })
    .catch(err => {
      console.log("Error in DB :", err);
    });
}

function fetchFromServer() {
  //single Record
  //firebase.database().ref('/questions/100'); 100 is the id

  //all Records
  var questions = firebase.database().ref("/questions/");
  questions.on("value", snapshot => {
    //on is short form of addEventListener
    var allQuestionObj = snapshot.val(); // snapshot is fake obj where the questions are present and contains lots of info but val lets us have the obj we need
    for (let key in allQuestionObj) {
      let questionObj = allQuestionObj[key];
      questionOperations.add(questionObj);
    }
    printQuestions(questionOperations.questions);
    updateCount();
  });
}

function printQuestions(questions) {
  document.querySelector("#questions").innerHTML = "";
  questions.forEach(printQuestion);
}

function deleteQuestion() {
  questionOperations.remove();
  printQuestions(questionOperations.questions);
}

function printQuestion(questionObject) {
  var tbody = document.querySelector("#questions");

  var tr = tbody.insertRow();
  var index = 0;

  for (let key in questionObject) {
    if (key == "markForDelete") {
      continue;
    }
    if (key == "options") {
      let options = questionObject[key];
      for (let option of options) {
        tr.insertCell(index).innerText = option;
        index++;
      }
      continue;
    }
    tr.insertCell(index).innerText = questionObject[key];
    index++;
  }
  var td = tr.insertCell(index);
  td.appendChild(
    createIcon("fas fa-trash mr-2 hand", toggleRed, questionObject.id)
  );
  td.appendChild(createIcon("fas fa-edit hand", edit, questionObject.id));
}

function addQuestion() {
  var questionObject = new Question();
  for (let key in questionObject) {
    if (key == "markForDelete") {
      continue;
    }
    if (key == "id") {
      questionObject[key] = document.getElementById(key).innerText;
      continue;
    }
    if (key == "options") {
      let options = [];
      for (let i = 1; i <= 4; i++) {
        options.push(document.getElementById("option" + i).value);
      }

      questionObject[key] = options;
      continue;
    }
    questionObject[key] = document.getElementById(key).value;
  }

  questionOperations.add(questionObject);
  printQuestion(questionObject);
  updateCount();
  printCounter();
}