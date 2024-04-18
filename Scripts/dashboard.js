function clicked_menu() {

    var sidebar = document.querySelector(".side-nav")
    var main = document.querySelector(".main-body")
    var header = document.querySelector(".header")
    var footer = document.querySelector(".footer")
    var panel = document.querySelector(".panel")

    var logo = document.querySelector(".logo-nav-logo")

    var hamburger = document.querySelector(".logo-nav-hamburguer")

    var menu_home = document.querySelector(".menu-options-home")
    var menu_home_label = document.querySelector(".menu-options-home-label")

    var menu_settings = document.querySelector(".menu-options-settings")
    var menu_settings_label = document.querySelector(".menu-options-settings-label")

    var network_img = document.querySelectorAll(".social-network-image")

    var dashboard_div = document.querySelector(".menu-options-home-dashboard");
    var dashboard_text = document.querySelector('.menu-options-home-dashboard-text');
    var dashboard_icon = document.querySelector('.menu-options-home-dashboard-icon');

    var camera_div = document.querySelector(".menu-options-home-camera");
    var camera_text = document.querySelector('.menu-options-home-camera-text');
    var camera_icon = document.querySelector('.menu-options-home-camera-icon');

    var general_div = document.querySelector(".menu-options-settings-general");
    var general_text = document.querySelector('.menu-options-settings-general-text');
    var general_icon = document.querySelector('.menu-options-settings-general-icon');

    var security_div = document.querySelector(".menu-options-settings-security");
    var security_text = document.querySelector('.menu-options-settings-security-text');
    var security_icon = document.querySelector('.menu-options-settings-security-icon');

    var alert_div = document.querySelector(".menu-options-settings-alert");
    var alert_text = document.querySelector('.menu-options-settings-alert-text');
    var alert_icon = document.querySelector('.menu-options-settings-alert-icon');

    if (sidebar.style.width != '10%') {

        menu_home.style.width = "50%"
        menu_settings.style.width = "50%"

        main.style.width = "90%"
        header.style.width ="100%"
        footer.style.width ="100%"
        panel.style.width= "100%"


        dashboard_div.style.justifyContent = "center";
        dashboard_text.style.display = 'none';
        dashboard_icon.style.justifyContent = 'center';

        camera_div.style.justifyContent = "center";
        camera_text.style.display = 'none';
        camera_icon.style.justifyContent = 'center';

        general_div.style.justifyContent = "center";
        general_text.style.display = 'none';
        general_icon.style.justifyContent = 'center';

        security_div.style.justifyContent = "center";
        security_text.style.display = 'none';
        security_icon.style.justifyContent = 'center';

        alert_div.style.justifyContent = "center";
        alert_text.style.display = 'none';
        alert_icon.style.justifyContent = 'center';

        sidebar.style.width = "10%"
        main.style.width = "90%"

        for (var i = 0; i < network_img.length; i++) {
            network_img[i].style.display = "none";
        }

        logo.style.display = "none"
        hamburger.style.width = "50%"
        menu_home_label.style.width = "80%"
        menu_settings_label.style.width = "80%"

    }
    else {
        menu_home.style.width = "100%";
        menu_settings.style.width = "100%";
    
        sidebar.style.width = "15%";
        main.style.width = "85%";

        dashboard_div.style.justifyContent = "";
        dashboard_text.style.display = '';
        dashboard_icon.style.justifyContent = '';
    
        camera_div.style.justifyContent = "";
        camera_text.style.display = '';
        camera_icon.style.justifyContent = '';
    
        general_div.style.justifyContent = "";
        general_text.style.display = '';
        general_icon.style.justifyContent = '';
    
        security_div.style.justifyContent = "";
        security_text.style.display = '';
        security_icon.style.justifyContent = '';
    
        alert_div.style.justifyContent = "";
        alert_text.style.display = '';
        alert_icon.style.justifyContent = '';
    
        logo.style.display = "flex";
        logo.style.width = "70%";
        logo.style.justifyContent = "center";
    
        hamburger.style.width = "30%";
    
        menu_home_label.style.width = "60%";
        menu_settings_label.style.width = "60%";

        for (var i = 0; i < network_img.length; i++) {
            network_img[i].style.display = "flex";
        }
    }
       

}