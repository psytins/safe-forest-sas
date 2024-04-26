function toggleMenu() {
    var sideNav = document.getElementById('sideNav');
    var style = window.getComputedStyle(sideNav);
    if (style.display === 'none' || style.display === '') {
        sideNav.style.display = 'flex';
    } else {
        sideNav.style.display = 'none';
    }
}

// Event listener for the hamburger menu icon
document.querySelector('.logo-nav').addEventListener('click', toggleMenu);
