// DOM Elements
// Get tables ...

// Functions
function showContainer(id) {

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
    else if (status == "block") {
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

// Event Listeners

// Initialize

//First view
document.getElementById("mycameras").style.display = "none";
document.getElementById("general").style.display = "none";
document.getElementById("security").style.display = "none";
document.getElementById("contacts").style.display = "none";
