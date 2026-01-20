




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")

 


  if (btn && icon && sidebar) {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("toggleSideBar")
    icon.classList.toggle("collapsed");
  })
} else {
  console.error("Missing required elements.")
}




