// DOM Elements
const VERSION = "1.2.1";
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

function toggleCancelMenu() {
    const menu = document.getElementById('add-camera-menu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

function selectPlan(plan) {
    var plan = document.getElementById(plan)
    var parentElement = plan.parentElement;

    for (var i = 0; i < parentElement.children.length; i++) {
        var child = parentElement.children[i];
        if (child.tagName.toLowerCase() === "div") {
            child.style.backgroundColor = "white";
            child.classList.remove("selected");
        }
    }
    plan.style.backgroundColor = "gray"
    plan.classList.toggle("selected");

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

    //phone number regex TODO!
    //email regex TODO!
    //check if ticket is checked
    if (!terms.checked) {
        alert("Please accept our terms and conditions.");
        return false;
    }

    return true;
}

function validateLoginForm() {
    const ERROR_COLOR = 'red';
    const DEFAULT_COLOR = 'black'

    const loginEmail = document.getElementById('login-input-email');
    const loginPassword = document.getElementById('login-input-pass');

    if (!loginEmail.value || !loginPassword.value) {
        alert("Please...");
        return false;
    }

    return true;
}

function validateNewPasswordForm() {
    const ERROR_COLOR = 'red';
    const DEFAULT_COLOR = 'black'

    const current_password = document.getElementById("input-current-password");
    const new_password = document.getElementById("input-new-password");
    const confirm_new_password = document.getElementById("input-confirm-password");

    if (!confirm("ARE YOU SURE?")) {
        return false;
    }

    if (!current_password.value || !new_password.value || !confirm_new_password.value) {
        alert("Please...");
        return false;
    }

    return true;

}

function validateDeleteAccount() {
    if (!confirm("ARE YOU SURE?")) {
        return false;
    }

    if (!confirm("THIS IS A DANGEROUS MOVE. ARE YOU STILL SURE?")) {
        return false;
    }

    if (!confirm("THIS WILL DELETE YOUR ACCOUNT AND ALL OF YOUR DATA, FOREVER! ARE YOU STILL SURE?")) {
        return false;
    }

    return true;
}

function validateRegisterCamera() {
    const ERROR_COLOR = 'red';
    const DEFAULT_COLOR = 'black'

    const friendly_name = document.getElementById("add-camera-friendly-name");
    const country = document.getElementById("add-camera-country");
    const gps_location = document.getElementById("add-camera-location");

    if (!friendly_name.value || !country.value || !gps_location.value) {
        alert("Please...");
        return false;
    }

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
            .then(response => { // data validation
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
                sessionStorage.setItem('_id', data.userID);
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

function changePassword() {
    const current_password = document.getElementById("input-current-password").value;
    const new_password = document.getElementById("input-new-password").value;
    const confirm_new_password = document.getElementById("input-confirm-password").value;

    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer

    if (validateNewPasswordForm()) {

        fetch('api/auth/account-change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ current_password, new_password, confirm_new_password, userID }),
        })
            .then(response => { // data validation
                if (response.status == 401) {
                    throw new Error(`Please fill all required fields! Status: ${response.status}`);
                } else if (response.status == 402) {
                    throw new Error(`Current Password is wrong! Status: ${response.status}`);
                } else if (response.status == 403) {
                    throw new Error(`Password dont match! Status: ${response.status}`);
                } else if (response.status == 404) {
                    throw new Error(`User not found! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                console.log('New password is set:', data);

                // Handle success ...
                alert("New password is set! Please authenticate with the new password.");
                signOut()
                // ...

            })
            .catch(error => {
                console.error('An error occured:', error);
                // Handle error ... 
                alert("Something went wrong... " + error);
                // ...
            });
    }
}

function deleteAccount() {
    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer

    if (validateDeleteAccount()) {
        fetch('/api/auth/account-delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID }),
        })
            .then(response => {
                // Handle response, then redirect
                alert("Your account has been deleted. Goodbye, and thank your for using our services.");
                signOut();
            })
            .catch(error => {
                // Handle error
                console.error('An error occured:', error);
            });
    }
}

function registerCamera() {
    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer // FK
    const camera_name = document.getElementById("add-camera-friendly-name").value; // temp
    const friendly_name = document.getElementById("add-camera-friendly-name").value;
    const sensitivity = 80; // temp
    const last_detected = null; //temp
    const subscription_plan = 1; // FK //temp free
    const camera_endpoint = null; //temp
    const country = document.getElementById("add-camera-country").value;
    const gps_location = document.getElementById("add-camera-location").value;
    const site_name = document.getElementById("add-camera-site-name").value;
    const brand_model = document.getElementById("add-camera-brand-model").value;
    const azimuth_bearing = document.getElementById("add-camera-azimuth-bearing").value;
    const camera_web_admin = document.getElementById("add-camera-admin-url").value;
    const public_ip_address = document.getElementById("add-camera-public-ip").value;
    const input_method = "HTTPS-POST"; //temp
    const current_status = 1; //temp

    if (validateRegisterCamera()) {

        fetch('api/camera/regist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    userID,
                    camera_name,
                    friendly_name,
                    sensitivity,
                    last_detected,
                    subscription_plan,
                    camera_endpoint,
                    country,
                    gps_location,
                    site_name,
                    brand_model,
                    azimuth_bearing,
                    camera_web_admin,
                    public_ip_address,
                    input_method,
                    current_status
                }),
        })
            .then(response => { // data validation
                if (response.status == 401) {
                    throw new Error(`Please fill all required fields! Status: ${response.status}`);
                } else if (response.status == 402) {
                    throw new Error(`Camera already registered! Status: ${response.status}`);
                } else if (response.status == 403) {
                    // error 403
                }
                return response.json();
            })
            .then(data => {
                console.log('Camera Registration successful:', data);

                // Handle success ...
                alert("Camera Registration successful!");
                location.reload();
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

async function loadOverallDetection() {
    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer
    const overallDetections = await fetch('/api/camera/overall-detection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            odList = [data.last24Hours, data.last7Days, data.last30Days]
            return odList
        })
        .catch(error => {
            console.error('Last Detect Listing failed:', error);
            alert(error);
        });

    return overallDetections;
}

async function loadLastDetectionList() {
    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer
    const lastDetectionList = await fetch('/api/camera/list-last-detection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tbodyLastDetect = document.getElementById("dynamicListCamera-dashboard-last-detection")
            data.detections.forEach(detection => {
                var dynamicEntryLD =
                    `
                <tr>
                    <td>#${detection.detectionID}</td>
                    <td>${detection.camera.camera_name}</td>
                    <td>${detection.description === null ? "N/A" : detection.description}</td>
                    <td>${detection.time}</td>
                    <td>${detection.createdAt}</td>
                </tr>
                `
                tbodyLastDetect.innerHTML += dynamicEntryLD;
            });

            return data.detections;
        })
        .catch(error => {
            console.error('Last Detect Listing failed:', error);
            alert(error);
        });

    return lastDetectionList;
}

async function loadCameraList() {
    const userID = parseInt(sessionStorage.getItem("_id"), 10); // Convert to integer
    const cameraList = await fetch('/api/camera/list-cameras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const tbodyMyCameras = document.getElementById("dynamicListCamera-mycameras");
            const tbodyDashboard = document.getElementById("dynamicListCamera-dashboard");
            data.cameras.forEach(camera => {
                // Dynamic Entry for Dashboard Camera List ----------------
                var dynamicEntryDS =
                    `
                <tr>
                    <td>#${camera.cameraID}</td>
                    <td>${camera.sensitivity}%</td>
                    <td>${camera.camera_name}</td>
                    <td>${camera.last_detected === null ? "N/A" : moment(camera.last_detected).format('YYYY-MM-DD -> HH:mm:ss')}</td>
                    <td>${camera.current_status === 1 ? "Online" : "Offline"}</td>
                </tr>
                `
                // Dynamic Entry for My Camera List ----------------
                var dynamicEntryMC =
                    `
                <tr>
                    <td>#${camera.cameraID}</td>
                    <td>${camera.sensitivity}%</td>
                    <td>${camera.camera_name}</td>
                    <td>${camera.last_detected === null ? "N/A" : moment(camera.last_detected).format('YYYY-MM-DD -> HH:mm:ss')}</td>
                    <td>${camera.current_status === 1 ? "Online" : "Offline"}</td>
                    <td>
                        <button onclick="changeCameraStatus(${camera.cameraID})" title="On/Off Camera" type="button"><i class="fa fa-power-off" aria-hidden="true"></i></button>
                        <button onclick="simulateDetection(${camera.cameraID})" title="Simulate a detection" type="button"><i class="fa fa-eye" aria-hidden="true"></i></button>
                        <button onclick="expandCameraInfo(${camera.cameraID})" title="Expand camera information" type="button"><i class="fa fa-info" aria-hidden="true"></i></button>
                    </td>
                </tr>
                `
                tbodyMyCameras.innerHTML += dynamicEntryMC;
                tbodyDashboard.innerHTML += dynamicEntryDS;
            });

            return data.cameras;
        })
        .catch(error => {
            console.error('Camera Listing failed:', error);
            alert(error);
        });

    return cameraList;
}

function changeCameraStatus(cameraID){
    alert("Coming Soon: Change camera status for camera #" + cameraID)
}

function simulateDetection(cameraID){
    alert("Coming Soon: Simulate detection for camera #" + cameraID)
}

function expandCameraInfo(cameraID){
    alert("Coming Soon: Expand camera information for camera #" + cameraID)
}

function loadDashboardInformation(cameraList, l24h, l7days, l30days) {
    const activeCameras = document.getElementById("active-cameras")
    const totalCameras = document.getElementById("total-cameras")

    const camerasOnline = document.getElementById("cameras-online")
    const camerasOffline = document.getElementById("cameras-offline")

    const last24Hours = document.getElementById("last-24-hours")
    const last7Days = document.getElementById("last-7-days")
    const last30Days = document.getElementById("last-30-days")

    var total = cameraList.length
    var onlineCamera = 0
    var offlineCamera = 0

    var last24 = l24h.length
    var last7 = l7days.length
    var last30 = l30days.length

    cameraList.forEach(camera => {
        if (camera.current_status == 1) {
            onlineCamera++
        }
        else if (camera.current_status == 0) {
            offlineCamera++
        }
    });

    activeCameras.innerText = onlineCamera
    totalCameras.innerText = total

    camerasOnline.innerText = onlineCamera
    camerasOffline.innerText = offlineCamera

    last24Hours.innerText = last24
    last7Days.innerText = last7
    last30Days.innerText = last30

}
// ------------------------------------------------

// Event Listeners

// Initialize - Load Functions

//First view - index - Load on authentication page
async function loadIndex() {
    document.getElementById("mycameras").style.display = "none";
    document.getElementById("general").style.display = "none";
    document.getElementById("security").style.display = "none";
    document.getElementById("contacts").style.display = "none";

    document.getElementById("greetings").innerText = getGreetingTime() + ", " + sessionStorage.getItem("name") + " #" + sessionStorage.getItem("_id");

    //General Personal Profile - Placeholders
    const fname = sessionStorage.getItem("name").split(" ")[0];
    const lname = sessionStorage.getItem("name").split(" ")[1];

    document.getElementById("fname").placeholder = fname;
    document.getElementById("lname").placeholder = lname;
    document.getElementById("email").placeholder = sessionStorage.getItem('email');
    document.getElementById("input-region").value = sessionStorage.getItem('country');
    document.getElementById("ref-code").placeholder = sessionStorage.getItem('refCode');;
    document.getElementById("application-version").innerText = VERSION;

    // Load Dashboard Data and MyCamera List
    const cameraList = await loadCameraList()
    const lastDetectionList = await loadLastDetectionList()
    const odDetections = await loadOverallDetection()
    loadDashboardInformation(cameraList, odDetections[0], odDetections[1], odDetections[2])
}

//First view - authentication - Load on authentication page
function loadAuthentication() {
    document.getElementById("login").style.display = "none";
    document.getElementById("application-version").innerText = VERSION;
}


