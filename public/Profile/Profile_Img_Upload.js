  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-img")
  const profileImgHolder=document.getElementById("profile-img-holder")
  const profileDetails=document.getElementById("profile-datails")
  const verificationContentLi=document.getElementById("content-li verification")
 
  let uploadImgRoute=""

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
  if(profileImg){

  profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="${profileImg}"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  uploadImgRoute="/Change_Profile_Image"
  }
  else{
     profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  uploadImgRoute="/Set_Profile_Image"
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


const imageDisplay=document.getElementById("image-display")
const imageSelectorBtn=document.getElementById("image-selector-btn")
const imageUploaderBtn=document.getElementById("image-uploader-btn")
const msgPara=document.getElementById("msg-id")


const fileInput = document.createElement("input")
fileInput.type = "file"
fileInput.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput.style.display = "none"

imageSelectorBtn.addEventListener("click", () => { 
    fileInput.click(); 
})

let croppedImage = null

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 512
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = targetSize
        canvas.height = targetSize

        // Crop to centered square
        const minSide = Math.min(img.width, img.height)
        const startX = (img.width - minSide) / 2
        const startY = (img.height - minSide) / 2

        // Draw cropped square scaled to 512x512
        ctx.drawImage(
          img,
          startX, startY, minSide, minSide, // source crop
          0, 0, targetSize, targetSize      // destination
        );

        // Convert to DataURL for preview
        const dataURL = canvas.toDataURL("image/webp",0.9)

        // Clear previous content
        
        imageDisplay.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})



imageUploaderBtn.addEventListener("click", async () => {
    if (!croppedImage) {
      msgPara.textContent="Pls Select An Image"
      return
    }
    const id=localStorage.getItem("currentUserId")

    const formData = new FormData();
    formData.append("image", croppedImage, "croppedImage")
    formData.append("id",id)

    try {
      const response = await axios.post(uploadImgRoute, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      console.log("Server response:", response.data)
      msgPara.textContent="Image Uploaded Succesfully"
      croppedImage = null
      imageDisplay.innerHTML =`
        <img src="assets/upload-icon.svg" alt="upload-icon" class="image-preview" id="image-preview">
        <h4 class="Upload-Img">Select Img</h4>
      `
      await getProfileDetails()
    } catch (error) {
    
      console.error("Upload failed:", error)
      msgPara.textContent="Error While Uploading Image"
    }
  })

