// const tabButton= addEventListener.getElementById("tab-btn")


document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("tab-btn");
  const icon = document.getElementById("tab-icon");
  const sidebar = document.querySelector(".side-bar");

  if (!btn || !icon || !sidebar) {
    console.error("Missing required elements.");
    return;
  }



  btn.addEventListener("click", () => {
    // Toggle the class on the sidebar
    sidebar.classList.toggle("toggleSideBar");

   
    icon.classList.toggle("collapsed");

   
  });
});
