(function(){
    
    const btnMenu = document.getElementById("btnMenu");
    
    if (btnMenu) {
        btnMenu.addEventListener("click", function() {
            const menu = document.getElementById("menuItems");

            if (menu) {
                if (menu.classList.contains("hidden")){
                    menu.classList.add("flex")
                    menu.classList.remove("hidden")
                } else {
                    menu.classList.add("hidden");
                    menu.classList.remove("flex");
                }
            }            
        });
    }

})()