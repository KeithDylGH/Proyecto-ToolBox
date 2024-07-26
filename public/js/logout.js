document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            fetch('/logout', {
                method: 'GET'
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/login';
                }
            });
        });
    }
});