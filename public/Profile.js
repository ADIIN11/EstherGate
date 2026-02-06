  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-img")
  const profileImgHolder=document.getElementById("profile-img-holder")
  const profileDetails=document.getElementById("profile-datails")
  const verificationContentLi=document.getElementById("content-li verification")
  const listProductSidebarLi=document.getElementById("list-product-li") 
 
  async function checkToken(){
    const token = localStorage.getItem("token")
    
    if(!token){
        console.log("Token does not exis,Pls Login")
        window.location.href='/'

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
            await getProfileDetails()

        }

        else{
            console.log("token expired pls login again")
            window.location.href='/'
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

async function getProfileDetails() {
  const id=localStorage.getItem("currentUserId")
  const userObj={id:id}
  const res = await axios.post("/Profile/Get_Profile_Details", userObj)
  console.log(res.data)
  const username=res.data.username
  const email=res.data.email
  const profileImg=res.data.profileImg
  const verification=res.data.verification
  const sellerVerification=res.data.sellerVerification
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
if(profileImg){
  profileImgHolder.innerHTML=`
  <img src="${profileImg}" alt="profile-icon" class="content-profile-img">
  `
}
if(verification&&sellerVerification){
  profileDetails.innerHTML=`
  <h2 class="profile-username">${username}</h2>
  <h3 class="profile-email">${email}</h2>
  <div class="verification-box">
      <img src="/assets/tick-icon.svg" alt="tick-icon" class="verification-icon">
      <h4 class="profile-verification">"Account Verified"</h1>
  </div>
  <div class="verification-box">
    <img src="/assets/tick-icon.svg" alt="tick-icon" class="verification-icon">
    <h4 class="profile-verification">"Seller Verified"</h1>
  </div>
  `
  verificationContentLi.classList.toggle("toggleVerificationOff")
}
else if(verification&&!sellerVerification){
  profileDetails.innerHTML=`
  <h2 class="profile-username">${username}</h2>
  <h3 class="profile-email">${email}</h2>
  <div class="verification-box">
      <img src="/assets/tick-icon.svg" alt="tick-icon" class="verification-icon">
      <h4 class="profile-verification">"Account Verified"</h1>
  </div>
  <div class="verification-box">
    <img src="/assets/attention-icon.svg" alt="attention-icon" class="verification-icon">
    <h4 class="profile-verification">"Seller Not Verified"</h1>
  </div>
  `
}
else{
  profileDetails.innerHTML=`
  <h2 class="profile-username">${username}</h2>
  <h3 class="profile-email">${email}</h2>
  <div class="verification-box">
      <img src="/assets/attention-icon.svg" alt="attention-icon" class="verification-icon">
      <h4 class="profile-verification">"Account Not Verified"</h1>
  </div>
  <div class="verification-box">
    <img src="/assets/attention-icon.svg" alt="attention-icon" class="verification-icon">
    <h4 class="profile-verification">"Seller Not Verified"</h1>
  </div>
  `

}
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
