




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-icon")
  const listProductSidebarLi=document.getElementById("list-product-li")
  
  const topSellingProductsSlide=document.getElementById("top-selling-products-slide")
  const mostViewedProductsSlide=document.getElementById("most-viewed-products-slide")
  const cartBadge=document.getElementById("cart-badge")

  const myCartProducts=document.getElementById("my-cart-products")

  let userHasSignedIn=false
  let id

  let idObj


 
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
            window.location.href="/Auth/Sign_In"
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
  
  id=localStorage.getItem("currentUserId")
  idObj={id:id}
  let res
  
  try{
    res = await axios.post("/Get_Profile_Img", idObj)
    
  }catch(err){
    console.log("error while signing in:",err)
    return
  }
  
  const profileImg=res.data.profileImg
  const username=res.data.username
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
  <img src="assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  }
  

sidebar.classList.toggle("userSignedIn")
cartBadge.classList.add("appear")
cartBadge.textContent=myCartItemNo
fetchMyCartProducts(idObj)


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





async function cartPage(){
  if(userHasSignedIn){
    window.location.href="/Profile/My_Cart"
  }
  console.log(productId)
  window.location.href="/Auth/Sign_In"
}

async function fetchMyCartProducts(idObj){

  let res
  try{
    res= await axios.post("/Profile/Cart_page/Get_My_Cart", idObj)
  }catch(err){
    console.log("error while fetching my cart:",err)
  }
  console.log(res.data)
  const myCart=res.data.myCart
  const products=res.data.products
  let myCartProductsText=``

  for(i=0;i<myCart.length;i++){

    let ratingsText=``
  const ratings=products[i].ratings
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
  if(products[i].noCustomersReviewed)
  ratingsText+=`<h4 class="reviewsNo"> ${products[i].noCustomersReviewed}</h4>`

    
    myCartProductsText +=`
    <div class="product-card" onclick="window.location.href='/Product/${products[i].name}/${myCart[i].productId}'">
                    <img src="${products[i].productImg1}" alt="Product image" class="product-image">
                    <div class="product-card-column">
                        <h3>${products[i].name}</h3>
                        <p>${products[i].sellerName}</p>
                    </div>
                    <div class="ratings-box" id="ratings-box">
                        <h4 class="seller-name">Rating:</h4>
                        ${ratingsText}
                        
                    </div>
                    <div class="product-card-column">
                        <p>Category: ${products[i].category}</p>
                        <p>Type: ${products[i].type}</p>
                    </div>
                    
                    <div class="product-card-column">
                        <div class="product-card-row">
                            <p>Item Quantity:</p>
                            
                        </div>
                        
                        <div class="product-card-row">
                            <button class="quantity-btn" id="quantity-decrement">-</button>
                            <p class="quantity-number">${myCart[i].quantity}</p>
                            <button class="quantity-btn" id="quantity-increment">+</button>  
                        </div> 
                           
                    </div>
                    
                    <div class="product-card-column">
                        <p>M.R.P: ${products[i].currency} ${products[i].price}</p>  
                        <p>Price: ${products[i].currency} ${products[i].price-((products[i].price/100)*products[i].discount)}<sup class="small-p">     ${products[i].discount}% off</sup></p>   
                    </div>
                     <div class="product-card-column">
                        <p>Remove From Cart:</p> 
                        <button class="delete-btn" id="quantity-increment" onclick="removeFromMyCart(${id},${myCart[i].quantity})">
                            <img src="/assets/dustbin-icon.svg" alt="Delete Item" class="delete-icon">
                        </button>
                     </div>
                </div>
    `
  }
  myCartProducts.innerHTML=myCartProductsText
}