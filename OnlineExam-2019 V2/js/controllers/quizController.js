window.addEventListener("load", init2);

//constant declarations
var totalScore = 0;
var currentQuestion = 0;
var totalQuestions = quesOp.questions.length;
var mainUser = localStorage.uid;
var enable = true;
var totalTime = 60;

const container = document.getElementById("quizContainer");
const questionName = document.getElementById("quizQuestion");
const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");
const nextButton = document.getElementById("nextButton");
const resultContainer = document.getElementById("result");
const previousButton = document.getElementById("previousButton");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const quizUser = document.getElementById("quizUser");
const resName = document.getElementById("resName");
const tyMsg = document.getElementById("tyMsg");
const goBackLogin = document.getElementById("goBackLogin");
const goBacktoGame = document.getElementById("goBacktoGame");

startBtn.disabled = true;
submitBtn.disabled = true;
previousButton.disabled = true;
nextButton.disabled = true;

function init2() {
    document.querySelector(".loader").style.display = "none";
    users();
    questions();
    bindEvents2();
    callRightAns();
}

function bindEvents2() {
    nextButton.addEventListener("click", loadNextQuestion);
    previousButton.addEventListener("click", loadPreviousQuestion);
    goBackLogin.addEventListener("click", backLogin);
    goBacktoGame.addEventListener("click", playAgain);
    startBtn.addEventListener("click", startOperations);
}

const playAgain = () => (location.href = "Quiz.html");

function backLogin() {
    location.href = "loginUser.html";
}

function questionFiller() {
    var allquestions = firebase.database().ref("/questions/");
    allquestions.on("value", snapshot => {
        //on is short form of addEventListener
        var allQuestionObj = snapshot.val(); // snapshot is fake obj where the questions are present and contains lots of info but val lets us have the obj we need
        for (let key in allQuestionObj) {
            let questionObj = allQuestionObj[key];
            quesOp.questions.push(questionObj);
        }
        console.log("questionsfilled");
    });
}

function questions() {
    questionFiller();
    enableStart();
}

function enableStart() {
    setTimeout(() => {
        startBtn.disabled = false;
    }, 3000);
}

function fill() {
    setTimeout(function fillUser() {
        quizUser.innerHTML = quesOp.users[
            quesOp.users.length - 2
        ].Name.toUpperCase();
        resName.innerHTML = quesOp.users[
            quesOp.users.length - 2
        ].Name.toUpperCase();
    }, 3000);
}

async function users() {
    await allUsersFilled();

    fill();
}

function allUsersFilled() {
    var allUsers = firebase.database().ref("/Users/");
    allUsers.on("value", snapshot => {
        var allQuestionObj = snapshot.val();
        for (let key in allQuestionObj) {
            let questionObj = allQuestionObj[key];
            quesOp.users.push(questionObj);
        }
        console.log("usersfilled");
    });
}

function startOperations() {
    startBtn.disabled = true;
    submitBtn.addEventListener("click", submitForm);
    submitBtn.disabled = false;
    timer();
    printQuestion();
}

function timer() {
    console.log("Im inside timer function");
    totalTime = 60;
    var clearTimer = setInterval(function () {
        var timer = document.getElementById("timerSec");
        totalTime--;

        timer.innerHTML = "00:" + totalTime;
        if (totalTime == 0) {
            submitForm();
            clearInterval(clearTimer);
        }
    }, 1000);

}

function printQuestion() {
    if (currentQuestion < quesOp.questions.length) {
        createQuestion(currentQuestion);
    }
    if (currentQuestion > 0) {
        previousButton.disabled = false;
        if (currentQuestion == (quesOp.questions.length - 1)) {
            nextButton.disabled = true;
        }
    } else {
        previousButton.disabled = true;
        nextButton.disabled = false;
    }
}

function unchecked() {
    Array.from(document.querySelectorAll('input[name="option"]'), input => input.checked = false);
}

function createQuestion(index) {
    unchecked();
    questionName.innerText = quesOp.questions[currentQuestion].name;
    opt1.innerText = quesOp.questions[currentQuestion].options[0];
    opt2.innerText = quesOp.questions[currentQuestion].options[1];
    opt3.innerText = quesOp.questions[currentQuestion].options[2];
    opt4.innerText = quesOp.questions[currentQuestion].options[3];
}

function loadNextQuestion(e) {
    e.preventDefault();
    Answers();
    currentQuestion++;
    printQuestion();

}

function Answers() {
    var selectedOption = document.querySelector('input[type="radio"]:checked');
    if (!(selectedOption)) {
        quesOp.answers[currentQuestion] = "Not Answered";
        console.log("check");
        console.log(quesOp.answers);
    } else {
        quesOp.answers[currentQuestion] = selectedOption.value;
        console.log(quesOp.answers);
    }
}

function callRightAns() {
    setTimeout(function ranswers() {
        console.log('you are inside rightanswers');

        for (let i = 0; i < (quesOp.questions.length); i++) {
            quesOp.ranswers.push(quesOp.questions[i].rans);

        }
    }, 3000);
}

function loadPreviousQuestion(e) {

    e.preventDefault();
    Answers();
    currentQuestion--;
    printQuestion();
}

function submitForm() {
    submitBtn.disabled = true;
    Answers();
    console.log("hello");
    for (let i = 0; i < (quesOp.answers.length); i++) { //check till length of answers only
        if (quesOp.answers[i] == quesOp.ranswers[i]) {
            console.log("rightAns");
            totalScore += parseInt(quesOp.questions[i].score);
        } else {
            console.log("wrongAns");
        }
    }

    console.log(totalScore);
    showResult();
    printResult(totalScore);
    printResMsg(totalScore);
    updateScore(totalScore);

    totalTime = -1;
}

function updateScore(totalScore) {
    var userId = localStorage.uid;
    var email = quesOp.users[quesOp.users.length - 2].Email;
    var username = quesOp.users[quesOp.users.length - 2].Name;
    var pwd = quesOp.users[quesOp.users.length - 2].Password;
    var score = totalScore;

    var user = {
        Email: email,
        Name: username,
        Password: pwd,
        Score: score
    }
    firebase.database().ref('/Users/' + userId).set(user);
}

function printResult(score) {
    var tScore = document.getElementById("tScore");
    var gScore = document.createElement("li");
    var rightAns = document.getElementById("rightAnsRes");
    var ansRes = document.getElementById("ansRes");

    gScore.innerHTML = score;
    gScore.setAttribute("class", "gscore");
    tScore.appendChild(gScore);

    for (let i = 0; i < quesOp.questions.length; i++) {
        var rscore = document.createElement("li");
        rscore.innerHTML = quesOp.questions[i].rans;
        rscore.setAttribute("class", "rscore");
        rightAns.appendChild(rscore);
    }
    for (let i = 0; i < quesOp.answers.length; i++) {
        var score = document.createElement("li");
        score.innerHTML = quesOp.answers[i];
        score.setAttribute("class", "rscore");
        ansRes.appendChild(score);
    }
}

function printResMsg(score) {
    if (score == 0) {
        tyMsg.innerHTML = "Dont feel low , Just Learn and Try Again!!";
    }
    if (score == 20 || score == 10) {
        tyMsg.innerHTML = "Nice Try, You just need a litle more practice!!";
    }
    if (score == 30 || score == 40) {
        tyMsg.innerHTML = "So Close , Just get your concepts Refreshed!!";
    }
    if (score >= 50) {
        tyMsg.innerHTML = "You are a Coding MAster!!";
    }
}

function showResult() {
    document.querySelector(".resultDiv").classList.toggle("showed");
}