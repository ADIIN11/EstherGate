




  const btn = document.getElementById("tab-btn")
  const icon = document.getElementById("tab-icon")
  const sidebar = document.querySelector(".side-bar")
  const sidebarProfileText=document.getElementById("sidebar-profile-text")
  const profileSubLi=document.getElementById("profile-sub-li")
  const profileImgDiv=document.getElementById("profile-icon")
  const listProductSidebarLi=document.getElementById("list-product-li")
  
  const mainProductGrid=document.getElementById("main-product-grid")
  const mostViewedProductsSlide=document.getElementById("most-viewed-products-slide")
   
  const searchInput = document.getElementById('search-inpt')
  const searchButton = document.getElementById('search-button')
  const resultsContainer = document.getElementById('searchResultsContainer')
  const autocompleteDropdown = document.getElementById('autocompleteDropdown')
  const cartBadge=document.getElementById("cart-badge")

  
  


  const pageHeading=document.getElementById("page-heading")

  let userHasSignedIn=false

  let typingTimer
 


 
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
        userHasSignedIn=false
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
    const res = await axios.post("/Store/Get_Top_Selling_Products",{page:currentTopSellingPage})
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
            <button onclick="addToCart('${topSellingProducts[i].productId}')" class="add-to-cart-btn">Add to Cart</button>
        </div> `
    }
  mainProductGrid.insertAdjacentHTML('beforeend', topSellingProductsRow)
  topSellingProductsRow=""
  } catch (err) {
          console.log(`failed to get Top Selling Product`, err)
  }finally {
    topSellingIsLoading = false;
  }

}


// For bottom of the scroll

window.addEventListener('scroll', () => {
  // window.innerHeight = The height of the user's visible screen/browser window
  // window.scrollY = How many pixels the user has scrolled down from the top
  // document.documentElement.scrollHeight = The total height of your entire webpage

  // We use a 100px buffer so it triggers just before they hit the absolute bottom
  const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100

  if (isAtBottom) {
    console.log("Reached the bottom of the page!")
    // Call your fetch function here
    getProductList()
  }
})





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
    const res = await axios.post("/Store/Get_Most_Viewed_Products",{page:currentMostViewedPage})
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
            <button onclick="addToCart('${mostViewedProducts[i].productId}')" class="add-to-cart-btn" >Add to Cart</button>
        </div> `
    }
  mainProductGrid.insertAdjacentHTML('beforeend', mostViewedProductsRow)
  mostViewedProductsRow=""
  } catch (err) {
          console.log(`failed to get Top Selling Product`, err)
  }finally {
    mostViewedIsLoading = false;
  }
}


const urlParts = window.location.pathname.split("/")
const pageRequest = urlParts[urlParts.length - 1]
const urlParams = new URLSearchParams(window.location.search)
const searchTerm = urlParams.get('search')


let searchResults = []
let searchResultsRow = ""
let currentSearchPage = 1
let searchIsLoading = false
let searchHasMoreProducts = true

async function getSearchResults(term) {
  if (searchIsLoading || !searchHasMoreProducts) {
    return
  }
  
  searchIsLoading = true

  try {
    const res = await axios.post('/Store/Search', { 
  searchTerm: term,
  page: currentSearchPage 
})
    currentSearchPage++
    
    const products = res.data.products
    searchResults = searchResults.concat(products)
    
    // If no products come back
    if (products.length === 0) {
      searchHasMoreProducts = false
      
      if (currentSearchPage === 2) {
        mainProductGrid.innerHTML = "<p style='text-align: center; padding: 2rem;'>No products found matching your search.</p>"
      }
      return
    }

    if (currentSearchPage === 2) {
      mainProductGrid.innerHTML = ""
    }

    for (let i = 0; i < products.length; i++) {
      const finalPrice = products[i].price - ((products[i].price / 100) * products[i].discount)
      
      searchResultsRow += ` 
        <div class="product-card">
          <a href="/Product/${products[i].name}/${products[i].productId}">
              <img src="${products[i].productImg1}" alt="Product image" class="product-image">
                  <h3>${products[i].name}</h3>
                  
                  <p>Price: ${products[i].currency} ${finalPrice.toFixed(2)}<sup class="small-p">     ${products[i].discount}% off</sup></p>
          </a>
            <button onclick="addToCart('${products[i].productId}')" class="add-to-cart-btn">Add to Cart</button>
        </div> `
    }
    
    mainProductGrid.insertAdjacentHTML('beforeend', searchResultsRow)
    searchResultsRow = ""
    
  } catch (err) {
    console.log(`failed to get Search Results`, err)
    if (currentSearchPage === 1) {
      mainProductGrid.innerHTML = "<p style='text-align: center; padding: 2rem;'>Something went wrong fetching results.</p>"
    }
  } finally {
    searchIsLoading = false
  }
}





let onSaleProducts = []
let onSaleProductsRow = ""
let currentOnSalePage = 1
let onSaleIsLoading = false
let onSaleHasMoreProducts = true

// Fetch and render On Sale list
async function getOnSaleList() {
  if (onSaleIsLoading || !onSaleHasMoreProducts) return
  onSaleIsLoading = true

  try {
    const res = await axios.post("/Store/Get_On_Sale_Products", { page: currentOnSalePage })
    currentOnSalePage++
    
    onSaleProducts = res.data.onSaleProducts 
    console.log(onSaleProducts)
    
    if (onSaleProducts.length === 0) {
      onSaleHasMoreProducts = false
      return
    }
    
    for (let i = 0; i < onSaleProducts.length; i++) {
      onSaleProductsRow += ` 
        <div class="product-card" >
          <a href="/Product/${onSaleProducts[i].name}/${onSaleProducts[i].productId}" >
              <img src="${onSaleProducts[i].productImg1}" alt="Product image" class="product-image">
                  <h3>${onSaleProducts[i].name}</h3>
                  <p>Price: ${onSaleProducts[i].currency} ${onSaleProducts[i].price - ((onSaleProducts[i].price / 100) * onSaleProducts[i].discount)}<sup class="small-p">     ${onSaleProducts[i].discount}% off</sup></p>
          </a>
            <button onclick="addToCart('${onSaleProducts[i].productId}')" class="add-to-cart-btn" >Add to Cart</button>
        </div> `
    }
    
    mainProductGrid.insertAdjacentHTML('beforeend', onSaleProductsRow)
    onSaleProductsRow = ""
    
  } catch (err) {
    console.log(`Failed to get On Sale Products`, err)
  } finally {
    onSaleIsLoading = false
  }
}

function getProductList() {
  if (searchTerm) {
    pageHeading.textContent = `Search Results for "${searchTerm}"`
    
    getSearchResults(searchTerm) 
  } 
  else if (pageRequest === "Top_Selling") {
    pageHeading.textContent = "Top Selling"
    getTopSellingList()
  } else if (pageRequest === "Most_Viewed") {
    pageHeading.textContent = "Most Viewed"
    getMostViewedList()
  } else if (pageRequest === "On_Sale") {
    pageHeading.textContent = "On Sale"
    getOnSaleList() 
  }
}

// Initialize
getProductList()



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




searchInput.addEventListener('input', () => {
  clearTimeout(typingTimer)
  const searchTerm = searchInput.value.trim()

  if (!searchTerm) {
    autocompleteDropdown.classList.add('hidden')
    return
  }

  // Waits 300ms after you stop typing to avoid spamming the backend
  typingTimer = setTimeout(() => {
    fetchAutocompleteSuggestions(searchTerm)
  }, 300) 
})

async function fetchAutocompleteSuggestions(searchTerm) {
  try {
    const res = await axios.post('/Search', { searchTerm: searchTerm })
    const products = res.data.products
    
    renderDropdown(products)
  } catch (error) {
    console.log("Error fetching suggestions:", error)
  }
}

function renderDropdown(products) {
  if (products.length === 0) {
    autocompleteDropdown.innerHTML = `<div class="suggestion-item">No results found</div>`
  } else {
    let dropdownHTML = ""
    const limit = Math.min(products.length, 5) 
    
    for (let i = 0; i < limit; i++) {
      const p = products[i]
      dropdownHTML += `
        <a href="/Product/${p.name}/${p.productId}" class="suggestion-item">
          <img src="${p.productImg1}" class="suggestion-img" alt="${p.name}">
          <div class="suggestion-details">
            <p class="suggestion-title">${p.name}</p>
            <p class="suggestion-category">in ${p.category}</p>
          </div>
        </a>
      `
    }
    autocompleteDropdown.innerHTML = dropdownHTML
  }
  
  autocompleteDropdown.classList.remove('hidden')
}

// Hides dropdown if user clicks elsewhere on the screen
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
    autocompleteDropdown.classList.add('hidden')
  }
})

// --- FULL SEARCH: Triggers on Button Click or Enter Key ---
function triggerFullSearch() {
  const searchTerm = searchInput.value.trim()

  if (!searchTerm) return

  autocompleteDropdown.classList.add('hidden') 

  // Instead of an axios call, we change the page URL!
  // encodeURIComponent safely handles spaces and special characters (e.g. "ps 5" becomes "ps%205")
  window.location.href = `/Store?search=${encodeURIComponent(searchTerm)}`
}

searchButton.addEventListener('click', triggerFullSearch)

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault() 
    triggerFullSearch()
  }
})