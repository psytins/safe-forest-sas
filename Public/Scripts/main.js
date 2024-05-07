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

function getGreetingTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 18) {
        return "Good afternoon";
    } else {
        return "Good night";
    }
}

function validateRegisterForm() {
    const ERROR_COLOR = 'red';
    const DEFAULT_COLOR = 'black'

    const fname = document.getElementById('input-fname');
    const lname = document.getElementById('input-lname');
    const email = document.getElementById('input-email');
    const password = document.getElementById('input-pass');
    const cpassword = document.getElementById('input-cpass');
    const phone = document.getElementById('input-phone');
    const terms = document.getElementById('input-terms');

    //phone number regex
    //check if ticket is checked
    if (!terms.checked) {
        return false;
    }

    return true;
}

function validateLoginForm() {
    const ERROR_COLOR = 'red';
    const DEFAULT_COLOR = 'black'

    const loginEmail = document.getElementById('login-input-email');
    const loginPassword = document.getElementById('login-input-pass');

    return true;
}

// ------------------------------------------------
// Requests to server ----------

function registerAccount() {

    const fname = document.getElementById('input-fname').value;
    const lname = document.getElementById('input-lname').value;
    const email = document.getElementById('input-email').value;
    const password = document.getElementById('input-pass').value;
    const cpassword = document.getElementById('input-cpass').value;
    const phone = document.getElementById('input-phone').value;
    const region = document.getElementById('input-region').value;
    const reference_code = null // tmp
    const logo = null // tmp

    if (validateRegisterForm()) {

        fetch('api/auth/account-regist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fname, lname, password, cpassword, email, phone, region, reference_code, logo }),
        })
            .then(response => {
                if (response.status == 401) {
                    throw new Error(`Please fill all required fields! Status: ${response.status}`);
                } else if (response.status == 402) {
                    throw new Error(`Email already exists! Status: ${response.status}`);
                } else if (response.status == 403) {
                    throw new Error(`Password dont match! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Registration successful:', data);

                // Handle success ...
                alert("Registration successful");
                showContainerAuthentication('login');
                // ...

            })
            .catch(error => {
                console.error('Registration failed:', error);
                // Handle error ... 
                alert(error);
                // ...
            });
    }
}

function performLogin() {
    const email = document.getElementById('login-input-email').value;
    const password = document.getElementById('login-input-pass').value;

    if (validateLoginForm()) {
        // fetch to validade login
        fetch('/api/auth/account-authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => {
                if (response.status == 401) {
                    throw new Error(`Invalid Credentials! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Login successful! ' + data);

                //Handle Success ...
                sessionStorage.setItem('name', data.name);
                sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('country', data.country);
                sessionStorage.setItem('refCode', data.ref_code);
                window.location.href = '/dashboard';
            })
            .catch(error => {
                console.error('Login failed:', error);
                alert(error);
            });
    }
}

function signOut() {
    // fetch to sign out
    fetch('/api/auth/account-signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // Handle response, then redirect
            sessionStorage.clear();
            window.location.href = '/authentication';
        })
        .catch(error => {
            // Handle error
            console.error('An error occured:', error);
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

    document.getElementById("greetings").innerText = getGreetingTime() + ", " + sessionStorage.getItem("name");

    //General Personal Profile - Placeholders
    const fname = sessionStorage.getItem("name").split(" ")[0];
    const lname = sessionStorage.getItem("name").split(" ")[1];

    document.getElementById("fname").placeholder = fname;
    document.getElementById("lname").placeholder = lname;
    document.getElementById("email").placeholder = sessionStorage.getItem('email');
    document.getElementById("input-region").value = sessionStorage.getItem('country');
    document.getElementById("ref-code").placeholder = sessionStorage.getItem('refCode');;
}

//First view - authentication - Load on authentication page
function loadAuthentication() {
    document.getElementById("login").style.display = "none";
}


