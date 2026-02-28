




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

  let userHasSignedIn=false


 


 
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
  const userObj={id:id}
  let res
  try{
    res = await axios.post("/Get_Profile_Img", userObj)
    
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

let topSellingProducts = []
let topSellingProductsRow=""
let currentTopSellingPage = 1
let topSellingIsLoading = false
let topSellingHasMoreProducts = true

async function getTopSellingList(){
  if (topSellingIsLoading|| !topSellingHasMoreProducts) 
    return
  topSellingIsLoading = true

  try{
    const res = await axios.post("/Product/Get_Top_Selling_Products",{page:currentTopSellingPage})
    currentTopSellingPage++
    topSellingProducts=res.data.topSellingProducts
    console.log(topSellingProducts)
    if(topSellingProducts.length===0){
      topSellingHasMoreProducts = false
      return
    }
    for(let i=0;i<topSellingProducts.length;i++){
    topSellingProductsRow +=` 
        <div class="product-card" >
          <a href="/Product/${topSellingProducts[i].name}/${topSellingProducts[i].productId}" >
              <img src="${topSellingProducts[i].productImg1}" alt="Product image" class="product-image">
                  <h3>${topSellingProducts[i].name}</h3>
            
                  
                  <p>Price: ${topSellingProducts[i].currency} ${topSellingProducts[i].price-((topSellingProducts[i].price/100)*topSellingProducts[i].discount)}<sup class="small-p">     ${topSellingProducts[i].discount}% off</sup></p>
          </a>
            <button onclick="addToCart('${topSellingProducts[i].productId}')" >Add to Cart</button>
        </div> `
    }
  topSellingProductsSlide.insertAdjacentHTML('beforeend', topSellingProductsRow)
  topSellingProductsRow=""
  } catch (err) {
          console.log(`failed to get Top Selling Product`, err)
  }finally {
    topSellingIsLoading = false;
  }

}


getTopSellingList()

topSellingProductsSlide.addEventListener('scroll', () => {
  const isAtRightEnd = topSellingProductsSlide.scrollLeft + topSellingProductsSlide.clientWidth >= topSellingProductsSlide.scrollWidth - 5

  if (isAtRightEnd) {
    getTopSellingList()
  }
})
// For bottom of the scroll
// const productContainer = document.getElementById('topSellingProductsSlide');

// productContainer.addEventListener('scroll', () => {
//   const isAtBottom = productContainer.scrollTop + productContainer.clientHeight >= productContainer.scrollHeight - 5;

//   if (isAtBottom) {
//     console.log("Reached the bottom of the div!");
//     // Call your fetch function here
//     getTopSellingList();
//   }
// });


let mostViewedProducts = []
let mostViewedProductsRow=""
let currentMostViewedPage = 1
let mostViewedIsLoading = false
let mostViewedHasMoreProducts = true

async function getMostViewedList(){
  if (mostViewedIsLoading|| !mostViewedHasMoreProducts) 
    return
  mostViewedIsLoading = true

  try{
    const res = await axios.post("/Product/Get_Most_Viewed_Products",{page:currentMostViewedPage})
    currentMostViewedPage++
    mostViewedProducts=res.data.mostViewedProducts
    console.log(mostViewedProducts)
    if(mostViewedProducts.length===0){
      mostViewedHasMoreProducts = false
      return
    }
    for(let i=0;i<mostViewedProducts.length;i++){
    mostViewedProductsRow +=` 
        <div class="product-card" >
          <a href="/Product/${mostViewedProducts[i].name}/${mostViewedProducts[i].productId}" >
              <img src="${mostViewedProducts[i].productImg1}" alt="Product image" class="product-image">
                  <h3>${mostViewedProducts[i].name}</h3>
            
                  
                  <p>Price: ${mostViewedProducts[i].currency} ${mostViewedProducts[i].price-((mostViewedProducts[i].price/100)*mostViewedProducts[i].discount)}<sup class="small-p">     ${mostViewedProducts[i].discount}% off</sup></p>
          </a>
            <button onclick="addToCart('${mostViewedProducts[i].productId}')" >Add to Cart</button>
        </div> `
    }
  mostViewedProductsSlide.insertAdjacentHTML('beforeend', mostViewedProductsRow)
  mostViewedProductsRow=""
  } catch (err) {
          console.log(`failed to get Top Selling Product`, err)
  }finally {
    mostViewedIsLoading = false;
  }

}

getMostViewedList()

mostViewedProductsSlide.addEventListener('scroll', () => {
  const isAtRightEnd = mostViewedProductsSlide.scrollLeft + mostViewedProductsSlide.clientWidth >= mostViewedProductsSlide.scrollWidth - 5

  if (isAtRightEnd) {
    getMostViewedList()
  }
})


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

async function cartPage(){
  if(userHasSignedIn){
    window.location.href="/Profile/My_Cart"
    return
  }
  window.location.href="/Auth/Sign_In"
}
