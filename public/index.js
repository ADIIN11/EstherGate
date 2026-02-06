




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-icon")
  const listProductSidebarLi=document.getElementById("list-product-li")
 
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
            
            // const username=res.data.username
            // const role=res.data.role
            const id=res.data.id
            
            // localStorage.setItem("currentUsername",username)
            // localStorage.setItem("currentUserRole",role)
            localStorage.setItem("currentUserId",id)
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
  // const userName = localStorage.getItem("currentUsername")
  // const role= localStorage.getItem("currentUserRole")
  const id=localStorage.getItem("currentUserId")
  const userObj={id:id}
  const res = await axios.post("/Get_Profile_Img", userObj)
  const profileImg=res.data.profileImg
  const username=res.data.username


  profileSubLi.innerHTML=`
    <a href="/Profile/My_Cart" class="sidebar-anchors sub">My Cart</a>
    <a href="/Profile/My_Orders" class="sidebar-anchors sub">My Orders</a>
    <a href="#" onclick="event.preventDefault(); signOut();" class="sidebar-anchors sub">Sign Out</a>
    `
  listProductSidebarLi.innerHTML=`
   <div class="super-li" >
        <a href="/Profile/List_Product" class="sidebar-anchors icon">
            <img src="/assets/list-item-icon.svg" alt="list-item-icon"  class="sidebar-icon"  >
        </a>
      
    <a href="/Profile/List_Product"  class="sidebar-anchors">List Product</a>
    </div>
    <div class="sub-li" id="profile-sub-li"> 
        <a href="/Profile/My_List_Product" class="sidebar-anchors sub">My Listed Products</a>
        <a href="/Profile/Earnings" class="sidebar-anchors sub">Earnings</a>
    </div>


  `

  if(profileImg){

  profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="${profileImg}"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  }
  else{
     profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  }
  

sidebar.classList.toggle("userSignedIn")
}

async function signOut(){
  
  const token = localStorage.getItem("token")
  const tokenObj={token:token}
  console.log(tokenObj)
  try{  
        
        const res = await axios.post("/Sign_Out", tokenObj)
        console.log(res.data.message)
        localStorage.removeItem("token")
        localStorage.removeItem("currentUserId")
        location.reload(true)
  }catch(err){
        console.error("Sign Out Error:", err)
  }
  
}