// DOM Elements
// Get tables ...

// Functions
function showContainerIndex(id) {

    //Put all none
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("mycameras").style.display = "none";
    document.getElementById("general").style.display = "none";
    document.getElementById("security").style.display = "none";
    document.getElementById("contacts").style.display = "none";

    var status = document.getElementById(id).style.display;

    if (status == "none") {
        document.getElementById(id).style.display = "flex";
    }
    else if (status == "flex") {
        document.getElementById(id).style.display = "none";
    }
}

function showContainerAuthentication(id) {

    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";


    var status = document.getElementById(id).style.display;

    if (status == "none") {
        document.getElementById(id).style.display = "flex";
    }
    else if (status == "flex") {
        document.getElementById(id).style.display = "none";
    }
}

function validateForm(className) {

    const content = document.getElementById(className).value;
    const validateRegex = new RegExp("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");

    // if contains only spaces
    if (content.trim == "")
        return false;

    //check regex
    if (!validateRegex.test(content))
        return false;

    return true;

}

function searchTable(searchID, tableID) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;

    input = document.getElementById(searchID);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableID);
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}



// ------------------------------------------------
// Requests
function registerAccount() {
    const fname = document.getElementById('input-fname').value;
    const lname = document.getElementById('input-lname').value;
    const email = document.getElementById('input-email').value;
    const password = document.getElementById('input-pass').value;
    const phone = document.getElementById('input-phone').value;
    const region = document.getElementById('input-region').value;
    const reference_code = null
    const logo = null

    fetch('/account-regist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname, lname, password, email, phone, region, reference_code, logo }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Registration successful:', data);

            // Handle success ...
            alert("Registration successful");
            // ...

        })
        .catch(error => {
            console.error('Registration failed:', error);
            // Handle error ... 
            alert('Registration failed:', error);
            // ...
        });
}

function performLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);

            //Handle Success ...
            // Store the authentication token securely
            //localStorage.setItem('authToken', data.authToken);
            //localStorage.setItem('username', data.username);
            //localStorage.setItem('userId', data.user_id);
            // ...

            // Example: Redirect to another page after successful login
            //window.location.href = '/dashboard.html';
        })
        .catch(error => {
            console.error('Login failed:', error);

            // Display error message to the user in a user-friendly way
            alert('Login failed. Please check your credentials and try again.');
        });
}
// ------------------------------------------------

// Event Listeners

// Initialize - Load Functions

//First view - index - Load on authentication page
function loadIndex() {
    document.getElementById("mycameras").style.display = "none";
    document.getElementById("general").style.display = "none";
    document.getElementById("security").style.display = "none";
    document.getElementById("contacts").style.display = "none";
}

//First view - authentication - Load on authentication page
function loadAuthentication() {
    document.getElementById("login").style.display = "none";
}


