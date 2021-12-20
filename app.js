const _password = "password";
const _username = "email";
let alertDisplayed = false; // refer to displayAlert();

const users = {
    "test@test.com": {
        "password": "123",
        "avatar": "test.png"
    },
    "massimo@massimo.com": {
        "password": "123456",
        "avatar": "massimo.png"
    }
};

// Submit the user credentials on enter
function pressEnter(event) {
    if (event.keyCode === 13) {
        logIn();
    }
}

// Make sure the user can log in with the correct credentials
function logIn() {
    const userEmail = document.getElementById("userEmail").value;
    const userPassword = document.getElementById("userPassword").value;
    // If the email and password match, give access to secure.html and save the credentials into the local storage
    if (isPasswordMatching(userEmail, userPassword)) {
        localStorage.setItem(_username, userEmail);
        localStorage.setItem(_password, userPassword);
        window.location = "secure.html";
    } else if (!alertDisplayed) {
        // Otherwise display an alert
        alertDisplayed = true;
        displayAlert("Your username and password do not match!")
        // And change the inputs to is-invalid (color effect)
        document.getElementById("userEmail").classList.add("is-invalid");
        document.getElementById("userPassword").classList.add("is-invalid");
    }
}

// Check if the email and password match
function isPasswordMatching(username, password) {
    const storedUser = users[username.toLowerCase()];
    if (storedUser === undefined) {
        return false;
    }
    return password === storedUser.password;
}


/******** secure.html ********** */

function loadSecure() {
    checkSession();
    displayUserInfo();
    displayCountries();
}

// If no local storage, redirect to home page
function checkSession() {
    if (!localStorage.getItem(_username) || !localStorage.getItem(_password)) {
        window.location = "index.html";
    }
}

// Fetch user info from the local storage and display it
function displayUserInfo() {
    const username = localStorage.getItem(_username);
    document.getElementById("username").innerHTML = "Username: " + username;
    document.getElementById("password").innerHTML = "Password: " + localStorage.getItem(_password);
    // Assign a default avatar
    const {avatar = "default.png"} = users[username.toLowerCase()];
    // Create img element for the avatar
    let userAvatar = document.createElement("img");
    userAvatar.className ="img-fluid mx-auto d-block w-50";
    userAvatar.src = "img/" + avatar; // img src starts with "img/...";
    document.getElementById("user-info").prepend(userAvatar); // add avatar to the div;
}

function displayCountries() {
    fetch("https://randomuser.me/api/?results=100")
        .then(res => res.json())
        .then(data => {
            const countries = parseCountries(data.results);
            showCountries(countries);
        })
}

// Select the interesting data (countries), check if it's flagged country and push elements into the list
// If any of the flagged countries is present, it will be marked and alert will be shown
function parseCountries(data) {
    let countriesArr = [];
    let isCountryFlagged = false;
    let showAlert = false;
    for (const item of data) {
        isCountryFlagged = isFlaggedCountry(item.location.country);
        const wrappedItem = wrapItem(item.location.country, isCountryFlagged);
        countriesArr.push(wrappedItem);
        if (isCountryFlagged) {
            showAlert = true;
        }
    }
    if (showAlert) {
        displayAlert("Iedereen komt als je LEO roept..");
    }
    return countriesArr;
}

// Checks for Switzerland
function isFlaggedCountry(country) {
    let listOfFlaggedCountries = ["switzerland"];
    return listOfFlaggedCountries.includes(country.toLowerCase());
}

// Return an item wrapped in a table tag
function wrapItem(country, isCountryFlagged) {
    let ret = "<tr>";
    ret += isCountryFlagged ? "<td class='bg-danger text-white'>" : "<td>";
    ret += `
                ${country}
                </td>
            </tr>
            `
    return ret;
}

// Add countries to the table
function showCountries(countries) {
    document.getElementById("countries-table").innerHTML = countries.join(' ');
    document.getElementById("row-table").classList.remove("d-none"); // display the table;
}

// Create and display an alert
function displayAlert(message) {
    let alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger alert-dismissible fade show text-center mb-0";
    alertDiv.id = "alert";
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `
        <strong>Warning!</strong> 
        ${message}`;

    document.body.prepend(alertDiv);

    // Make the alert disappear
    setTimeout(() => {
        document.getElementById("alert").remove();
        alertDisplayed = false; // allow the alert to be displayed again;
    }, 5000);
}

// Go back to index.html and clear the local storage
function logOut() {
    window.location = "index.html";
    localStorage.clear();
}