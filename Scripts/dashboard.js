function clicked_menu() {
  var sidebar = document.querySelector('.container');
  var sidebarLinks = document.querySelectorAll('.container a');

  // Check if the sidebar is collapsed (based on the presence of a CSS class)
  var isCollapsed = sidebar.classList.contains('collapsed');

  if (isCollapsed) {
      // Show all links
      sidebarLinks.forEach(function(link) {
          link.style.display = 'block';
      });
      // Remove the collapsed class to expand the sidebar
      sidebar.classList.remove('collapsed');
  } else {
      // Hide all links
      sidebarLinks.forEach(function(link) {
          link.style.display = 'none';
      });
      // Add the collapsed class to collapse the sidebar
      sidebar.classList.add('collapsed');
  }
}