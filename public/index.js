




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-img")
 
  async function checkToken(){
    const token = localStorage.getItem("token")
    
    if(!token){
        console.log("Token does not exis,Pls Login")

    }
    else {

      const tokenObj={
        token:token
    }
      try{

        const res = await axios.post("/Token_Verification", tokenObj)
        if(res.data.tokenVerified){
            
            const username=res.data.username
            const role=res.data.role
            const id=res.data.id
            
            localStorage.setItem("currentUsername",username)
            localStorage.setItem("currentUserRole",role)
            localStorage.setItem("currentUserId",id)
            localStorage.setItem("TokenData","true")
            console.log("Token Verified")
            await userSinedIn()

        }

        else{
            console.log("token expired pls login again")
        }
    }  
        catch(err){
        console.error("Error:", err)
        }


    }
  }
checkToken()


  if (btn && icon && sidebar) {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("toggleSideBar")
    icon.classList.toggle("collapsed");
  })
} else {
  console.error("Missing required elements.")
}



async function userSinedIn(){
  const userName = localStorage.getItem("currentUsername")
  const role= localStorage.getItem("currentUserRole")
  const id=localStorage.getItem("currentUserId")
  console.log(userName)

  
  profileSubLi.innerHTML=`
  <a href="/Profile" class="sidebar-anchors sub">Profile</a>
  <a href="/Profile/My_Cart" class="sidebar-anchors sub">My Cart</a>
  <a href="/Profile/My_Orders" class="sidebar-anchors sub">My Orders</a>
  <a href="/Profile/log-out" class="sidebar-anchors sub">Sign Out</a>
  `
  const userObj={id:id}
  const res = await axios.post("/Get_Profile_Img", userObj)
  const profileImg=res.data.profileImg

  profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="${profileImg}"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${userName}</a>
  `


sidebar.classList.toggle("userSignedIn")
}

