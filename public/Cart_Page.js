




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

  
  const searchInput = document.getElementById('search-inpt')
  const searchButton = document.getElementById('search-button')
  const resultsContainer = document.getElementById('searchResultsContainer')
  const autocompleteDropdown = document.getElementById('autocompleteDropdown')
  const myCartProducts=document.getElementById("my-cart-products")

  const total=document.querySelector(".total")
  const totalProductsColumn=document.getElementById("total-products-column")
  const totalSlnoColumn=document.getElementById("total-slno-column")
  const totalMrpColumn=document.getElementById("total-mrp-column")
  const totalConvertedColumn=document.getElementById("total-converted-column")
  const totalCurrencyInpt=document.getElementById("total-currency-inpt")
  const totalDiscountColumn=document.getElementById("total-discount-column")
  const totalDiscountedColumn=document.getElementById("total-discounted-column")
  const totalQuantityColumn=document.getElementById("total-quantity-column")
  const totalTotalColumn=document.getElementById("total-total-column")

  const totalServiceRow=document.getElementById("total-service-row")
  const totalTotalRow=document.getElementById("total-total-row")
  const totalGrandRow=document.getElementById("total-grand-row")

  
  let typingTimer


  let userHasSignedIn=false
  let id

  let idObj
  let targetCurrency="USD"

  
const symbolToIsoMap = {
  // Literal characters (what the browser renders visually)
  "$": "USD",
  "₹": "INR", 
  "£": "GBP",
  "€": "EUR",
  "¥": "JPY",

  // HTML Entity strings (in case raw HTML code markup is passed)
  "&#36;": "USD",
  "&#8377;": "INR", 
  "&#163;": "GBP",
  "&#8364;": "EUR",
  "&#165;": "JPY"
}


 
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
  <img src="/assets/profile-icon.svg"  alt="logo"  class="sidebar-icon"  >
  </a>
  <a href="/Profile" class="sidebar-anchors" >${username}</a>
  `
  }
  

sidebar.classList.toggle("userSignedIn")
cartBadge.classList.add("appear")
cartBadge.textContent=myCartItemNo
await fetchMyCartProducts(idObj)
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
  if(myCart.length===0){
    total.classList.add("disappear")
    myCartProducts.innerHTML=`
    <h2>Cart Is Empty :( </h2>
    `
    return
  }
  const products=res.data.products
  const newPrices = await getConvertedPrices(products, targetCurrency)
  let myCartProductsText=``

  totalSlnoColumn.innerHTML=`<h3 class="column-header" >Sl.no</h3>`
  totalProductsColumn.innerHTML=`<h3 class="column-header" >Products</h3>`
  totalMrpColumn.innerHTML=`<h3 class="column-header" >M.R.P</h3>`
  totalConvertedColumn.innerHTML=``
  totalDiscountColumn.innerHTML=`<h3 class="column-header">Discount</h3>`
  totalDiscountedColumn.innerHTML=`<h3 class="column-header">Discounted Price</h3>`
  totalQuantityColumn.innerHTML=`<h3 class="column-header">Quantity</h3>`
  totalTotalColumn.innerHTML=`<h3 class="column-header">Total</h3>`

  totalTotalRow.innerHTML=`<h3 class="column-header">Total: </h3>`
  totalServiceRow.innerHTML=`<h3 class="column-header">Service Charge(0.5%):</h3>`
  totalGrandRow.innerHTML=`<h2 class="column-header">Grand Total:</h2>`


  let grandTotal=0

  for(let i=0;i<myCart.length;i++){

    let ratingsText=``
  const ratings=products[i].ratings
  const decimalPart = (ratings % 1).toFixed(2)
  const intPart=ratings-decimalPart 
  let starAdded=0
  for(let j=1;j<=intPart;j++){
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
                    <img src="${products[i].productImg1}" alt="Product image" class="product-image" >
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
                            <button class="quantity-btn" id="quantity-decrement" onclick="event.stopPropagation();decrementQuantity('${myCart[i].productId}');">-</button>
                            <p class="quantity-number">${myCart[i].quantity}</p>
                            <button class="quantity-btn" id="quantity-increment" onclick="event.stopPropagation();incrementQuantity('${myCart[i].productId}');">+</button>  
                        </div> 
                           
                    </div>
                    
                    <div class="product-card-column">
                        <p>M.R.P: ${products[i].currency} ${products[i].price}</p>  
                        <p>Price: ${getSymbolString(targetCurrency)} ${(newPrices[i]-((newPrices[i]/100)*products[i].discount)).toFixed(2)}<sup class="small-p">     ${products[i].discount}% off</sup></p>  
                    </div>
                     <div class="product-card-column">
                        <p>Remove From Cart:</p> 
                        <button class="delete-btn" id="quantity-increment" onclick="event.stopPropagation();removeProduct('${myCart[i].productId}');">
                            <img src="/assets/dustbin-icon.svg" alt="Delete Item" class="delete-icon">
                        </button>
                     </div>
                </div>
    `
  totalSlnoColumn.innerHTML+=`<p>${i+1}</p>`
  totalProductsColumn.innerHTML+=`<p>${products[i].name}</p>`
  totalMrpColumn.innerHTML+=`<p>${products[i].currency} ${products[i].price}</p>`
  totalConvertedColumn.innerHTML+=`<p>${getSymbolString(targetCurrency)} ${newPrices[i]}</p>`
  totalDiscountColumn.innerHTML+=`<p>${products[i].discount}% OFF</p>`
  totalDiscountedColumn.innerHTML+=`<p>${getSymbolString(targetCurrency)} ${(newPrices[i]-((newPrices[i]/100)*products[i].discount)).toFixed(2)}</p>`
  totalQuantityColumn.innerHTML+=`<p>${myCart[i].quantity}</p>`
  totalTotalColumn.innerHTML+=`<p>${getSymbolString(targetCurrency)} ${((newPrices[i]-((newPrices[i]/100)*products[i].discount))*myCart[i].quantity).toFixed(2)}</p>`

  grandTotal+=Number((((newPrices[i]-((newPrices[i]/100)*products[i].discount))*myCart[i].quantity).toFixed(2)))
  }
  totalServiceRow.innerHTML+=`<h3 class="end">${getSymbolString(targetCurrency)} ${(((grandTotal.toFixed(2))/100)*0.5).toFixed(2)}</h3>`
  totalTotalRow.innerHTML+=`<h3 class="end">${getSymbolString(targetCurrency)} ${grandTotal.toFixed(2)}</h3>`
  totalGrandRow.innerHTML+=`<h2 class="end">${getSymbolString(targetCurrency)} ${(Number(grandTotal.toFixed(2))+Number((((grandTotal.toFixed(2))/100)*0.5).toFixed(2))).toFixed(2)} </h2>`
  myCartProducts.innerHTML=myCartProductsText
}




async function incrementQuantity(productId){
    const id=localStorage.getItem("currentUserId")
    const cartObj={
      userId:id,
      productId:productId
    }
    try{
       const res = await axios.post("/Profile/Cart_page/Increament_Quantity", cartObj)
       await userSignedIn()
       await fetchMyCartProducts(idObj)
    }catch(err){
      console.log(":Error while incrementing quantity",err)
    }
}

async function decrementQuantity(productId){
    const id=localStorage.getItem("currentUserId")
    const cartObj={
      userId:id,
      productId:productId
    }
    try{
       const res = await axios.post("/Profile/Cart_page/Decreament_Quantity", cartObj)
       await userSignedIn()
       await fetchMyCartProducts(idObj)
    }catch(err){
      console.log(":Error while decrementing quantity",err)
    }
}

async function removeProduct(productId){
    const id=localStorage.getItem("currentUserId")
    const cartObj={
      userId:id,
      productId:productId
    }
    try{
       const res = await axios.post("/Profile/Cart_page/Remove_Product", cartObj)
       await userSignedIn()
       await fetchMyCartProducts(idObj)
    }catch(err){
      console.log(":Error while removing product",err)
    }
}


totalCurrencyInpt.addEventListener('change', async (event) => {
   targetCurrency = event.target.value
   await fetchMyCartProducts(idObj)
})





async function getConvertedPrices(productsObj, targetCurrencyIso) {
  try {
    // FIXED: Fetch from your own backend proxy instead of the external API to bypass CORS
    const response = await fetch('/Profile/My_Cart/Exchange-Rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: targetCurrencyIso })
    })
    
    if (!response.ok) throw new Error("Network response was not ok")
    
    const data = await response.json()
    const rates = data.rates

    const convertedPricesArray = productsObj.map(product => {
      const productCurrencyIso = symbolToIsoMap[product.currency.trim()]

      if (!productCurrencyIso) {
        console.warn(`Unknown currency symbol: ${product.currency}`)
        return product.price
      }

      if (productCurrencyIso === targetCurrencyIso) {
        return product.price
      }

      const exchangeRate = rates[productCurrencyIso]
      if (exchangeRate) {
        const newPrice = product.price / exchangeRate
        return Number(newPrice.toFixed(2))
      } else {
        console.warn(`Rate not found for ${productCurrencyIso}`)
        return product.price
      }
    })

    return convertedPricesArray

  } catch (error) {
    console.error("Failed to fetch exchange rates:", error)
    return productsObj.map(product => product.price)
  }
}

const isoToSymbolMap = Object.fromEntries(
  Object.entries(symbolToIsoMap).map(([key, value]) => [value, key])
)

const getSymbolString = (isoValue) => {
  return isoToSymbolMap[isoValue]
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