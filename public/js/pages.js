document.addEventListener("DOMContentLoaded", function () {
    const pages = JSON.parse(localStorage.getItem("pages"));
    const username = localStorage.getItem("username")

    document.getElementById('UserName').textContent = username
    const pagesContainer = document.getElementById("accordionSidebar");
    const currentPath = window.location.pathname;

    if (pages && pagesContainer) {
        pages.forEach((page) => {
            const pageElement = document.createElement("li");
            pageElement.classList.add("nav-item");

            if (page.pageName && page.pageRoute) {
                const linkElement = document.createElement("a");
                linkElement.classList.add("nav-link");
                linkElement.href = page.pageRoute;

                // Add active class if current page matches
                if (currentPath === page.pageRoute) {
                    linkElement.classList.add("active");
                }

                // Add icon and text
                const iconElement = document.createElement("i");
                // iconElement.classList.add("fas", "fa-file-alt"); // Default icon
                const textElement = document.createElement("span");
                textElement.textContent = page.pageName;

                // Append icon and text to the <a> element
                linkElement.appendChild(iconElement);
                linkElement.appendChild(textElement);
                pageElement.appendChild(linkElement);
            } else {
                pageElement.textContent = page.pageName || "Unnamed Page";
            }

            pagesContainer.appendChild(pageElement);
        });
    }
});
