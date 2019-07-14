window.addEventListener("load", init);

function init() {
    bindEvents();
    saveAdminDetails();
}

function bindEvents() {
    document.getElementById("loginBtn").addEventListener('click', loginToQuizPage);
    document.getElementById("registerBtn").addEventListener('click', registerUser);
    document.querySelector('.hide-register-btn').addEventListener('click', resetMessage);
}

function registerUser() {
    var username = document.getElementById('registerUsername').value;
    var pwd = document.getElementById('registerPwd').value;
    var message = document.getElementById('registerMsg');
    var email = document.getElementById('registerEmail').value;
    var form = document.getElementById('registerForm');
    var user = {
        Name: username,
        Password: pwd,
        Email: email,
        Score: "",
    };

    if (username == '' || pwd == '' || email == '') {
        message.innerHTML = 'Username or Age or Email cannot be empty !';
    } else {
        if (pwd.length < 5) {
            message.innerHTML = 'Password lenght cannot be less than 5 letters';
        } else {
            if (isEmail(email) == false) {
                message.innerHTML = 'email invalid';
            } else {

                localStorage.clear();
                var promise = firebase.database().ref('Users');
                var data = promise.push(user);
                var key = data.key;
                localStorage.uid = key;
                console.log(localStorage.uid);

                message.innerHTML = 'You have been Registered,Type same values for Username and Password and login ';
            }
        }
    }
    form.reset();

}

function resetMessage() {
    var message = document.getElementById('registerMsg');
    var form = document.getElementById("registerForm");
    form.reset();
    message.innerHTML = '';

}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    return regex.test(email);
}

function saveAdminDetails() {
    var adminDetails = {
        Name: "Piyush",
        Password: "piyush1234"
    };

    var Admin = "Admin";
    var promise = firebase
        .database()
        .ref("/Users/" + Admin)
        .set(adminDetails);
    promise
        .then(data => {
            console.log(adminDetails);
        })
        .catch(err => {
            console.log(err);
        });
}


function loginToQuizPage() {
    var user = document.getElementById("usernameLogin").value;
    var pwd = document.getElementById("passwordLogin").value;
    var error = document.getElementById("errorLogin");

    var users = firebase.database().ref("/Users/");
    users.on("value", snapshot => {
        var allUsers = snapshot.val();
        console.log(allUsers.Admin.Name);
        if (user == allUsers.Admin.Name && pwd == allUsers.Admin.Password) {
            location.href = "admin.html";
        } else {
            if (user == pwd) {
                if (user == "" || pwd == "") {
                    error.innerText = "Username or Password cannot be empty!";
                } else {
                    location.href = "quiz.html";
                }
            } else {
                error.innerText = "Username or Password is not Correct";
            }
        }
    });
}