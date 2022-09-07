// This is where it all goes :)


document.addEventListener("DOMContentLoaded", function(event) { 
    const btn = document.getElementById("mobile-menu-button");
    const menu = document.getElementById("mobile-menu");
    
    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });    
});
