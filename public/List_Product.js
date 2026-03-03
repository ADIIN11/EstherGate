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
  const productFullNameInpt=document.getElementById("product-full-name-inpt")
  const productPriceInpt=document.getElementById("product-price-inpt")
  const currencyInpt=document.getElementById("currency-inpt")
  const categoryInpt=document.getElementById("category-inpt")
  const categoryInptList=document.getElementById("category-inpt-list")
  const typeInpt=document.getElementById("type-inpt")
  const typeInptList=document.getElementById("type-inpt-list")
  const productInventoryInpt=document.getElementById("product-inventory-inpt")
  const productDiscountInpt=document.getElementById("product-discount-inpt")

  const listProductSidebarLi=document.getElementById("list-product-li")
  const listProduct=document.getElementById("list-product")

  
  const listProductBtn=document.getElementById("list-product-btn")
  const uploaderMsgPara=document.getElementById("uploader-msg-id")
  const loadingIcon=document.getElementById("loading-icon")
 
  const productDescription=document.getElementById("product-description")
  const createTagBtn=document.getElementById("create-tag-btn")
  const createTagInpt=document.getElementById("create-tag-inpt")
  const createTagMsg=document.getElementById("create-tag-msg")
  const tagBox=document.getElementById("tag-box")

  const cartBadge=document.getElementById("cart-badge")

  let userHasSignedIn=false
  let tags=[]
  let categoryList=[]
  let typesList=[]
  let uploadImgRoute=""
  let username=""
  let croppedImage1 = null
  let croppedImage2 = null
  let croppedImage3 = null
  let croppedImage4 = null
  let croppedImage5 = null

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
  let res
  try{
  res = await axios.post("/Profile/Get_Profile_Details", userObj)
  }catch(err){
    console.log("error while fetching profile details:",err)
    return
  }
  console.log(res.data)
  username=res.data.username
  const email=res.data.email
  const profileImg=res.data.profileImg
  const verification=res.data.verification
  const sellerVerification=res.data.sellerVerification
  const myCartItemNo=res.data.myCartItemNo

  userHasSignedIn=true


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

cartBadge.classList.add("appear")
cartBadge.textContent=myCartItemNo
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
        userHasSignedIn=false
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
          },2500)
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
          },2500)
          return
        }
      }
      tags.push(createTagInpt.value)
      createTagMsg.classList.add("appear")
      createTagMsg.textContent="New Tag Created"
      setTimeout(()=>{
            createTagMsg.textContent=""
            createTagMsg.classList.remove("appear")
          },2500)
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
          },2500)

}



categoryInpt.addEventListener("input",()=>{
  if (categoryList.includes(categoryInpt.value)) { 
    getTypesList(categoryInpt.value)
  } else { 
  }
  
})

async function getTypesList(category){
  try{
  const categoryObj={category:category}
  const res = await axios.post("/Product/Get_Category_Types", categoryObj) 
  typesList=[]
  typesList=res.data.types
  console.log(typesList)
 
  typeInptList.innerHTML=``
  for(let i=0;i<typesList.length;i++){
    typeInptList.innerHTML+=`
      <option value="${typesList[i]}">
    `
  }
}catch(err){
  console.error("Error While fetching types", err)
}
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
  categoryInptList.innerHTML=``
  for(let i=0;i<categoryList.length;i++){
    categoryInptList.innerHTML+=`
      <option value="${categoryList[i]}">
    `
  }
}


listProductBtn.addEventListener("click",()=>{
  if(!productNameInpt.value||!productFullNameInpt.value
    ||!productPriceInpt.value||!categoryInpt.value
    ||!typeInpt.value||!productInventoryInpt.value||!productDiscountInpt.value){
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Pls fill all the box" 

      setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
          },2500)
  }else if(!currencyInpt.value){
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Pls Select the currency of price" 

      setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
          },2500)
  }else if(!croppedImage1){
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Pls Select a image for the product" 

      setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
          },2500)
  }else if(!productDescription.value){
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Pls Enter the product description" 

      setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
          },2500)
  }else if(tags.length === 0){
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Pls create tags for the product" 

      setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
          },2500)
  }else{
  createProduct()
  }
})

function generateProductId() { 
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}


async function createProduct(){
  const productId=generateProductId()
  const id=localStorage.getItem("currentUserId")
  const productObj={
    productId: productId,
    name: productNameInpt.value,
    fullName:productFullNameInpt.value,
    price: Number(productPriceInpt.value),
    currency:currencyInpt.value,
    createdAt: new Date().toDateString(),
    sellerId: id,
    sellerName:username,
    category: categoryInpt.value,
    type: typeInpt.value,
    description:productDescription.value,
    tags:tags,
    inventory:Number(productInventoryInpt.value),
    discount:Number(productDiscountInpt.value),
    views:0,
    addedToCart:0,
    productBought:0,
    ratings:0,
    noCustomersReviewed:0,
    customerReviews:null,
    productImg1:null,
    productImg1PubId:null,
    productImg2:null,
    productImg2PubId:null,
    productImg3:null,
    productImg3PubId:null,
    productImg4:null,
    productImg4PubId:null,
    productImg5:null,
    productImg5PubId:null,
  }
  
  // category model creation 
  try{
    if(categoryList.includes(categoryInpt.value)&&typesList.includes(typeInpt.value)){
    const typeUpdateObj={ 
      productId:productId,
      category:categoryInpt.value,
      type:typeInpt.value
    }
    const res = await axios.post("/Product/Update_Type", typeUpdateObj)
  }else if(categoryList.includes(categoryInpt.value)&&!typesList.includes(typeInpt.value)){
    const addTypeObj={ 
      productId:productId,
      category:categoryInpt.value,
      type:typeInpt.value
    }
    const res = await axios.post("/Product/Add_Type", addTypeObj)
    getTypesList(categoryInpt.value)
  }else{
    const createCategoryObj={
      productId:productId,
      category:categoryInpt.value,
      type:typeInpt.value
    }
    
     const res = await axios.post("/Product/Create_Category", createCategoryObj)
     console.log(createCategoryObj)
     await getCategoryList()
     getTypesList(categoryInpt.value)
  }
  }catch(err){
    console.log("err while updating Category List:",err)
    return
  }

  // product model creation
  try{
    loadingIcon.classList.add("appear")
    uploaderMsgPara.classList.add("appear")
    uploaderMsgPara.textContent="Listing New Product"
    const res = await axios.post("/Product/Create_Product", productObj)
    uploaderMsgPara.textContent=res.data.message
    uploaderMsgPara.textContent="Uploading Product Images"
    const croppedImages = [croppedImage1, croppedImage2, croppedImage3, croppedImage4, croppedImage5]
    for(let i=0;i<5;i++){
      if(croppedImages[i]){
        const formData = new FormData();
        formData.append("image", croppedImages[i], "croppedImage")
        formData.append("productId",productId)
        formData.append("imageNumber",i+1)
        try {
          const response = await axios.post("/Product/Upload_Product_Image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          console.log("Server response:", response.data)
          } catch (error) {
          console.error(`product image ${i+1} Upload failed:`, error)
        }
      }
    }
    productNameInpt.value=""
    productFullNameInpt.value=""
    productPriceInpt.value=""
    currencyInpt.value=""
    categoryInpt.value=""
    typeInpt.value=""
    productDescription.value=""
    tagBox.innerHTML=""
    productInventoryInpt.value=""
    productDiscountInpt.value=""
    imageDisplay1.innerHTML=`
    <img src="/assets/product-icon.svg" alt="upload-icon" class="image-preview" id="image-preview">
    <h4 class="Upload-Img">Select Product Img</h4>
    `
    imageDisplay2.innerHTML=`
      <img src="/assets/add-icon.svg" alt="upload-icon" class="sub-image-preview" id="image-preview">
    `
    imageDisplay3.innerHTML=`
      <img src="/assets/add-icon.svg" alt="upload-icon" class="sub-image-preview" id="image-preview">
    `
    imageDisplay4.innerHTML=`
      <img src="/assets/add-icon.svg" alt="upload-icon" class="sub-image-preview" id="image-preview">
    `
    imageDisplay5.innerHTML=`
      <img src="/assets/add-icon.svg" alt="upload-icon" class="sub-image-preview" id="image-preview">
    `

    loadingIcon.classList.remove("appear")
    uploaderMsgPara.textContent="Product Listed Succesfully, Redirecting to My Listed Products"
    setTimeout(()=>{
            uploaderMsgPara.textContent=""
            uploaderMsgPara.classList.remove("appear")
            window.location.href='/Home'
          },3000)

  }catch(err){
    console.log("err while Listing Product:",err)
  }
}

async function cartPage(){
  if(userHasSignedIn){
    window.location.href="/Profile/My_Cart"
  }
  console.log(productId)
  window.location.href="/Auth/Sign_In"
}













// imageUploaderBtn.addEventListener("click", async () => {
//     if (!croppedImage) {
//       msgPara.textContent="Pls Select An Image"
//       return
//     }
//     const id=localStorage.getItem("currentUserId")

//     const formData = new FormData();
//     formData.append("image", croppedImage, "croppedImage")
//     formData.append("id",id)

//     try {
//       const response = await axios.post(uploadImgRoute, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       })
//       console.log("Server response:", response.data)
//       msgPara.textContent="Image Uploaded Succesfully"
//       croppedImage = null
//       imageDisplay.innerHTML =`
//         <img src="/assets/upload-icon.svg" alt="upload-icon" class="image-preview" id="image-preview">
//         <h4 class="Upload-Img">Select Img</h4>
//       `
//       await getProfileDetails()
//     } catch (error) {
    
//       console.error("Upload failed:", error)
//       msgPara.textContent="Error While Uploading Image"
//     }
//   })

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