document.addEventListener("DOMContentLoaded", async function () {
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        
        const token = localStorage.getItem('token');
        
        const data = {
            userToken: token
        };
        
        try {
            const res = await fetch('/api/logout', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            
            const type = localStorage.getItem('type');
            
            if (type === "1") {
                localStorage.clear();
                window.location.href = "/api/su";
            } else {
                localStorage.clear();
                window.location.href = "/api/";
            }
        } catch (error) {
            console.log(error);
        }
    });
});
