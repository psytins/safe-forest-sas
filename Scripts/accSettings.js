function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
        mainContent.style.marginLeft = '250px';
    } else {
        sidebar.style.left = '-250px';
        mainContent.style.marginLeft= '0';
    }
}

// Toggle the sidebar on hamburger click
document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);

// Close the sidebar with the close button (x)
document.querySelector('.close-btn').addEventListener('click', toggleMenu);

/* Add your form submission handler here if needed */

document.addEventListener('DOMContentLoaded', (event) => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
    });
});
