




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-icon")
  const listProductSidebarLi=document.getElementById("list-product-li")
  
  const topSellingProductsSlide=document.getElementById("top-selling-products-slide")
  const productHolder=document.getElementById("product-holder")

  const imageDisplay1=document.getElementById("image-display-1") 
  const imageDisplay2=document.getElementById("image-display-2") 
  const imageDisplay3=document.getElementById("image-display-3") 
  const imageDisplay4=document.getElementById("image-display-4") 
  const imageDisplay5=document.getElementById("image-display-5") 
  const imageDisplays=[imageDisplay1,imageDisplay2,imageDisplay3,imageDisplay4,imageDisplay5]
  const productImageDisplay=document.getElementById("product-image-display")
  const productDetails=document.getElementById("product-details")
  const ratingsBox=document.getElementById("ratings-box")

  const productDescription=document.getElementById("product-description")

  const cartBadge=document.getElementById("cart-badge")

  const addToCartBtn=document.getElementById("add-to-cart-btn")
  const buyProductBtn=document.getElementById("buy-product-btn")

  const reviewRatingsBox=document.getElementById("review-ratings-box")
  const reviewSubmitBtn=document.getElementById("review-submit-btn")
  const reviewSubmitMsg=document.getElementById("review-submit-msg")
  const productReviewTextbox=document.getElementById("product-review-textbox")
  const reviewSlide=document.getElementById("review-slide")


  let userHasSignedIn=false
  
  let productObj
  let reviewsObj
  let imageSelected=1
  let starSelected=0
  let username=""


 
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
            await userSignedIn()

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



async function userSignedIn(){
  // const userName = localStorage.getItem("currentUsername")
  // const role= localStorage.getItem("currentUserRole")
  const id=localStorage.getItem("currentUserId")
  const idObj={id:id}
  let res
  try{
  res = await axios.post("/Get_Profile_Img", idObj)
  }catch(err){
    console.log("error while signing in:",err)
    return
  }
  const profileImg=res.data.profileImg
  username=res.data.username
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
  }
  else{
     profileImgDiv.innerHTML=`
  <a href="/Profile" class="sidebar-anchors icon" >
  <img src="/assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  }
  

sidebar.classList.toggle("userSignedIn")
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




document.querySelectorAll('.image-selector-display').forEach(el => {
    el.addEventListener('click', () => {
        // remove selection from all
        document.querySelectorAll('.image-selector-display').forEach(e => e.classList.remove('selected'))
        
        // add selection to clicked one
        el.classList.add('selected')

        // get tabindex value
        imageSelected = Number(el.getAttribute('tabindex'))
        const imgKey = `productImg${imageSelected}`
        if(productObj[imgKey])
          productImageDisplay.innerHTML=`<img src="${productObj[imgKey]}" alt="product-icon" class="" >`
        else
          productImageDisplay.innerHTML=`
            <img src="/assets/product-icon.svg" alt="product-icon" class="image-preview" id="image-preview">
            <h4 class="Upload-Img">Product Img Not Found</h4>
          `
    });
});

const urlParts = window.location.pathname.split("/"); 
const productId = urlParts[urlParts.length - 1]


async function fetchProduct(productId) { 
  try { 
    const res = await axios.get(`/Product/${productId}`)
    console.log("Product info:", res.data)
    if(!res.data.product){
      productHolder.innerHTML=`<h2>Product Does Not Exists</h2>`
    }
    reviewsObj=res.data.productReviews
    return res.data.product
    } catch (err) { 
      console.error("Error fetching product:", err)
    } 
  }
async function getProduct(){
  productObj=await fetchProduct(productId)
  if(!productObj)
    return
  for(let i=0;i<5;i++){
    const imgKey = `productImg${i+1}`
    if(productObj[imgKey])
    imageDisplays[i].innerHTML=`<img src="${productObj[imgKey]}" alt="product-icon" class="image-selector-preview" >` 

  }
  const imgKey = `productImg${imageSelected}`
  productImageDisplay.innerHTML=`<img src="${productObj[imgKey]}" alt="product-icon" class="" >`

  productDetails.innerHTML=`
  <h2 class="product-name">${productObj.name}</h2> 
    <h3 class="product-full-name">${productObj.fullName}</h3>
    <h4 class="Category">Category:${productObj.category}</h4>
    <h4 class="Type">Type:${productObj.type}</h4>
    <h4 class="seller-name">Seller Name: ${productObj.sellerName}</h4>
    <h4 class="mrp">${productObj.discount}% OFF   <del>${productObj.currency}${productObj.price}</del></h4>
    <h2 class="price">${productObj.currency} ${productObj.price-((productObj.price/100)*productObj.discount)}</h2>
    
  `



  let ratingsText=`<h4 class="seller-name">Rating:</h4>`
  const ratings=productObj.ratings
  const decimalPart = (ratings % 1).toFixed(2)
  const intPart=ratings-decimalPart 
  let starAdded=0
  for(let i=1;i<=intPart;i++){
    ratingsText+=`<img src="/assets/full-star.svg" alt="product-icon" class="stars" id="stars">`
    starAdded++
  }
  if(decimalPart>=0.45){
    ratingsText+=`<img src="/assets/half-star.svg" alt="product-icon" class="stars" id="stars">`
    starAdded++
  }
  while((5-starAdded)!=0){
    ratingsText+=`<img src="/assets/empty-star.svg" alt="product-icon" class="stars" id="stars">`
    starAdded++
  }
  if(productObj.noCustomersReviewed)
  ratingsText+=`<h4 class="seller-name"> ${productObj.noCustomersReviewed}</h4>`
    
  ratingsBox.innerHTML=ratingsText

  productDescription.innerHTML+=`<p> ${productObj.description}</p>`

}

getProduct()

async function cartPage(){
  if(userHasSignedIn){
    window.location.href="/Profile/My_Cart"
    return
  }
  window.location.href="/Auth/Sign_In"
}



async function addToCart(productId){
  if(userHasSignedIn){
    const id=localStorage.getItem("currentUserId")
    const cartObj={
      userId:id,
      productId:productId
    }
    try{
       const res = await axios.post("/Add_To_Cart", cartObj)
       await userSignedIn()
    }catch(err){
      console.log(":Error while adding to cart",err)
    }
    return
  }
  console.log(productId)
  window.location.href="/Auth/Sign_In"
}

addToCartBtn.addEventListener("click",()=>{
addToCart(productId)
})

buyProductBtn.addEventListener("click",()=>{
addToCart(productId)
window.location.href="/Profile/My_Cart"
})



// Listen for clicks on the container
reviewRatingsBox.addEventListener('click', (e) => {
    // Only proceed if the clicked element is a star
    if (e.target.classList.contains('review-stars')) {
        
        // e.target refers to the specific image clicked, not the container
        starSelected = Number(e.target.getAttribute('tabindex'));
        console.log("Selected Rating:", starSelected);

        let reviewRatingsText = `<h3 class="seller-name">Give Rating:</h3>`;
        const decimalPart = Number((starSelected % 1).toFixed(2));
        const intPart = Math.floor(starSelected);
        let starAdded = 0;

        // Add full stars (Notice we are adding tabindex back in)
        for(let i = 1; i <= intPart; i++){
            reviewRatingsText += `<img src="/assets/full-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }
        
        // Add half star
        if(decimalPart >= 0.45){
            reviewRatingsText += `<img src="/assets/half-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }
        
        // Add empty stars
        while((5 - starAdded) > 0){
            reviewRatingsText += `<img src="/assets/empty-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }

        // Update the DOM
        reviewRatingsBox.innerHTML = reviewRatingsText;
    }
});

function generateReviewId() {
  return 'rev_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}



 reviewSubmitBtn.addEventListener("click",async ()=>{
  console.log(Number(starSelected))
  if(userHasSignedIn===false){
    window.location.href='/Auth/Sign_In'
  }else if(Number(starSelected)===0){
    reviewSubmitMsg.classList.add("appear")
    reviewSubmitMsg.textContent="Please select a star rating"
    setTimeout(()=>{
            reviewSubmitMsg.textContent=""
            reviewSubmitMsg.classList.remove("appear")            
          },3000)

  }else if(!productReviewTextbox.value){
    reviewSubmitMsg.classList.add("appear")
    reviewSubmitMsg.textContent="Please Write Product Review"
    setTimeout(()=>{
            reviewSubmitMsg.textContent=""
            reviewSubmitMsg.classList.remove("appear")            
          },3000)

  }else{
    const id=localStorage.getItem("currentUserId")
    const reviewObj={
      reviewId:generateReviewId(),
      userId:id,
      username:username,
      productId:productId,
      rating:Number(starSelected),
      review:productReviewTextbox.value,
      reviewLiked:0
    }
    try{
      const res = await axios.post("/Product/Submit_Product_Review", reviewObj)
      reviewSubmitMsg.classList.add("appear")
    reviewSubmitMsg.textContent="Review Submitted Successfully"
    setTimeout(()=>{
            reviewSubmitMsg.textContent=""
            reviewSubmitMsg.classList.remove("appear")            
          },3000)
      
    }catch(err){
      console.log("error while submitting review:",err)
      reviewSubmitMsg.classList.add("appear")
    reviewSubmitMsg.textContent="Error While Submitting Review"
    setTimeout(()=>{
            reviewSubmitMsg.textContent=""
            reviewSubmitMsg.classList.remove("appear")            
          },3000)
    }
    starSelected =0
    let reviewRatingsText = `<h3 class="seller-name">Give Rating:</h3>`;
        const decimalPart = Number((starSelected % 1).toFixed(2));
        const intPart = Math.floor(starSelected);
        let starAdded = 0;

        for(let i = 1; i <= intPart; i++){
            reviewRatingsText += `<img src="/assets/full-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }
        if(decimalPart >= 0.45){
            reviewRatingsText += `<img src="/assets/half-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }
        while((5 - starAdded) > 0){
            reviewRatingsText += `<img src="/assets/empty-star.svg" alt="product-icon" class="review-stars" tabindex="${starAdded + 1}">`;
            starAdded++;
        }
        reviewRatingsBox.innerHTML = reviewRatingsText;
        productReviewTextbox.value=""
        window.location.reload()
  
  }
})