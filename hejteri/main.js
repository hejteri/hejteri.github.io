var redi1, redi2;

const firebaseConfig = {
    apiKey: "AIzaSyB7HqOKwA3XilJ48Ts2cVuJH7PsuuVhzH0",
    authDomain: "hejterii.firebaseapp.com",
    databaseURL: "https://hejterii-default-rtdb.firebaseio.com",
    projectId: "hejterii",
    storageBucket: "hejterii.appspot.com",
    messagingSenderId: "565517537560",
    appId: "1:565517537560:web:7a71dda2e3e3c3c2680e6d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function AuthButtons() {
    var loginButton = document.getElementById('loginbut');
    var panelButton = document.getElementById('panelbut');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (loginButton) {
                loginButton.setAttribute('href', '#');
                loginButton.setAttribute('onclick', 'logout()');
                loginButton.textContent = 'Logout';
            }
            if (panelButton) {
                panelButton.textContent = 'Panel';
                panelButton.setAttribute('href', 'https://hejteri.github.io/panel');
            }
            if (redi1) {
                window.location.href = 'https://hejteri.github.io/panel';
            }
        } else {
            if (loginButton) {
                loginButton.textContent = 'Login';
                loginButton.setAttribute('href', 'https://hejteri.github.io/panel/login');
            }
            if (panelButton) {
                panelButton.remove();
            }
            if (redi2) {
                window.location.href = 'https://hejteri.github.io/panel/login';
            }
        }
    });
}

function logout() {
    firebase.auth().signOut().then(function () { location.reload(); }).catch(function () {});
}

function toggleMenu() {
    var navElement = document.querySelector('nav');
    navElement.classList.toggle('visible');
}
