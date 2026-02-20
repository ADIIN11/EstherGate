
async function getMostViewedList(){
  try{
    const res = await axios.post("/Product/Get_Most_Viewed_Products")
    mostViewedProducts=res.data.mostViewedProducts
    console.log(mostViewedProducts)
    for(let i=0;i<mostViewedProducts.length;i++){
    mostViewedProductsRow +=` 
        <div class="product-card" >
          <a href="/Product/${mostViewedProducts[i].name}/${mostViewedProducts[i].productId}" >
              <img src="${mostViewedProducts[i].productImg1}" alt="Product image" class="product-image">
                  <h3>${mostViewedProducts[i].name}</h3>
            
                  
                  <p>Price: ${mostViewedProducts[i].currency} ${mostViewedProducts[i].price-((mostViewedProducts[i].price/100)*mostViewedProducts[i].discount)}<sup class="small-p">     ${mostViewedProducts[i].discount}% off</s></sup></p>
                 
                
          </a>
            <button onclick="addToCart(${mostViewedProducts[i].productId})" >Add to Cart</button>
        </div> `
    }
  mostViewedProductsSlide.innerHTML=mostViewedProductsRow
  } catch (err) {
          console.error(`failed to get Top Selling Product`, err)
  }

}