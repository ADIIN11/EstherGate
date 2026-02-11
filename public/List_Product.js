  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-img")
  const profileImgHolder=document.getElementById("profile-img-holder")
  const profileDetails=document.getElementById("profile-datails")
  const verificationContentLi=document.getElementById("content-li verification")

  const imageDisplay1=document.getElementById("image-display-1") 
  const imageSelectorBtn=document.getElementById("image-selector-btn")
  const imageDisplay2=document.getElementById("image-display-2") 
  const imageDisplay3=document.getElementById("image-display-3") 
  const imageDisplay4=document.getElementById("image-display-4") 
  const imageDisplay5=document.getElementById("image-display-5") 

  const productNameInpt=document.getElementById("product-name-inpt")
  const productPriceInpt=document.getElementById("product-price-inpt")
  const currencyInpt=document.getElementById("currency-inpt")
  const categoryInpt=document.getElementById("category-inpt")
  const categoryInptList=document.getElementById("category-inpt-list")
  const typeInpt=document.getElementById("type-inpt")
  const typeInptList=document.getElementById("type-inpt-list")

  const listProductSidebarLi=document.getElementById("list-product-li")
  const listProduct=document.getElementById("list-product")

  
  const imageUploaderBtn=document.getElementById("image-uploader-btn")
  const msgPara=document.getElementById("msg-id")
 

  const createTagBtn=document.getElementById("create-tag-btn")
  const createTagInpt=document.getElementById("create-tag-inpt")
  const createTagMsg=document.getElementById("create-tag-msg")
  const tagBox=document.getElementById("tag-box")


  
  let categoryList=[]
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
  uploadImgRoute="/Profile/Change_Profile_Image"
  }
  else{
     profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="/assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  uploadImgRoute="/Profile/Set_Profile_Image"
  }
if(profileImg){
  profileImgHolder.innerHTML=`
  <img src="${profileImg}" alt="profile-icon" class="content-profile-img">
  `
}else{
  profileImgHolder.innerHTML=`
  <img src="/assets/profile-icon.svg" alt="profile-icon" class="content-profile-img">
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
  await getCategoryList()
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
  listProduct.classList.add("disappearForm")
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
  listProduct.classList.add("disappearForm")
  
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




const fileInput1 = document.createElement("input")
fileInput1.type = "file"
fileInput1.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput1.style.display = "none"


imageDisplay1.addEventListener("click", () => { 
    fileInput1.click(); 
})

imageSelectorBtn.addEventListener("click", () => { 
    fileInput1.click(); 
})

let croppedImage1 = null

fileInput1.addEventListener("change", () => {
    const file = fileInput1.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 1024
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
        
        imageDisplay1.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay1.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage1 = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})


const fileInput2 = document.createElement("input")
fileInput2.type = "file"
fileInput2.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput2.style.display = "none"

imageDisplay2.addEventListener("click", () => { 
    fileInput2.click(); 
})

let croppedImage2 = null

fileInput2.addEventListener("change", () => {
    const file = fileInput2.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 1024
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
        
        imageDisplay2.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay2.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage2 = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})

const fileInput3 = document.createElement("input")
fileInput3.type = "file"
fileInput3.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput3.style.display = "none"

imageDisplay3.addEventListener("click", () => { 
    fileInput3.click(); 
})

let croppedImage3 = null

fileInput3.addEventListener("change", () => {
    const file = fileInput3.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 1024
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
        
        imageDisplay3.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay3.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage3 = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})



const fileInput4 = document.createElement("input")
fileInput4.type = "file"
fileInput4.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput4.style.display = "none"

imageDisplay4.addEventListener("click", () => { 
    fileInput4.click(); 
})

let croppedImage4 = null

fileInput4.addEventListener("change", () => {
    const file = fileInput4.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 1024
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
        
        imageDisplay4.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay4.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage4 = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})

const fileInput5 = document.createElement("input")
fileInput5.type = "file"
fileInput5.accept = "image/png,image/jpg,image/jpeg,image/webp"
fileInput5.style.display = "none"

imageDisplay5.addEventListener("click", () => { 
    fileInput5.click(); 
})

let croppedImage5 = null

fileInput5.addEventListener("change", () => {
    const file = fileInput5.files[0]
    if (!file){ 
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const targetSize = 1024
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
        
        imageDisplay5.innerHTML = ""

        // Show preview
        const previewImg = document.createElement("img")
        previewImg.src = dataURL;
        previewImg.style.maxWidth = "100%"
        previewImg.style.maxHeight = "100%"
        previewImg.style.objectFit = "cover"

        imageDisplay5.appendChild(previewImg);

        canvas.toBlob((blob) => {
            croppedImage5 = blob 
            }, "image/webp")
      }
    }
reader.readAsDataURL(file)
})


let tags=[]


createTagBtn.addEventListener("click", () => { 
    createTag()
})

function createTag(){
  if(!createTagInpt.value){
      createTagMsg.classList.add("appear")
      createTagMsg.textContent="Pls Enter Tag Name"
      setTimeout(()=>{
            createTagMsg.textContent=""
            createTagMsg.classList.remove("appear")
          },2000)
    }
    else{
      let i
      for(i=0;i<tags.length;i++){
        if(tags[i]===createTagInpt.value){
          createTagMsg.classList.add("appear")
          createTagMsg.textContent="Tag Already Exists"
          createTagInpt.value=""
          setTimeout(()=>{
            createTagMsg.textContent=""
            createTagMsg.classList.remove("appear")
          },2000)
          return
        }
      }
      tags.push(createTagInpt.value)
      createTagMsg.classList.add("appear")
      createTagMsg.textContent="New Tag Created"
      setTimeout(()=>{
            createTagMsg.textContent=""
            createTagMsg.classList.remove("appear")
          },2000)
      console.log(tags)
      tagBox.innerHTML+=`
      <div class="tag" id="tag-${i+1}">
          <p>${createTagInpt.value}</p>
          <img src="/assets/cross-icon-neg.svg" alt="delete tag" onclick="deleteTag(${i+1})">
      </div>
      `
      createTagInpt.value=""
    }
}

function deleteTag(tagNumber){
  tags.splice(1,tagNumber)
  console.log(tags)
  const tag = document.getElementById(`tag-${tagNumber}`)
  if (tag) 
    tag.remove()
  createTagMsg.classList.add("appear")
  createTagMsg.textContent="Tag Deleted" 
      setTimeout(()=>{
            createTagMsg.textContent=""
            createTagMsg.classList.remove("appear")
          },2000)

}



categoryInpt.addEventListener("input",()=>{
  typeDataList(categoryInpt.value)
})

async function typeDataList(category){
  const categoryObj={category:category}
  console.log(categoryObj)
  const res = await axios.post("/Product/Get_Category_Types", categoryObj)
  
}


async function getCategoryList(){
    try{
        const res = await axios.post("/Product/Get_Categories")
        console.log(res.data)
        categoryList=res.data.categories
        updateCategoryList()

  }catch(err){
        console.error("Error While fetching category list", err)
  }
  
}

function updateCategoryList(){
  for(let i=0;i<categoryList.length;i++){
    categoryInptList.innerHTML+=`
      <option value="${categoryList[i]}">
    `
  }
}

function createProduct(){
  const productId=123567

  // category model creation 
  if(categoryList.includes(categoryInpt)){

  }
  // product model creation
}













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
        <img src="/assets/upload-icon.svg" alt="upload-icon" class="image-preview" id="image-preview">
        <h4 class="Upload-Img">Select Img</h4>
      `
      await getProfileDetails()
    } catch (error) {
    
      console.error("Upload failed:", error)
      msgPara.textContent="Error While Uploading Image"
    }
  })

// imageDeletionBtn.addEventListener("click", async () => {
//   const id=localStorage.getItem("currentUserId")
//   const userObj={id:id}
//    try {
//   const res = await axios.post("/Profile/Delete_Profile_Image", userObj)
//   console.log("Server response:", res.data)
//   msgPara.textContent="Image Deleted Succesfully"
//   await getProfileDetails()
//   } catch (error) {
    
//       console.error("Upload failed:", error)
//       msgPara.textContent="Error While Deleting Image"
//     }
// })