// const tabButton= addEventListener.getElementById("tab-btn")

// template for array

// let products=[{
//   name:"teddybear",
//   id:"3532643",
//   img:"/assets/product image/Teddy-Bear-Day.jpg",
//   category:{Toys:"plushies"},
//   price:400,
//   seller:"ToyShopIN"
//   description:"para about product "
// }]

let products = [
  {
    name: "gloves",
    id: "1002341",
    img: "/assets/product image/Gloves.jpeg",
    category: { Clothing: "accessories" },
    price: 299,
    seller: "WinterGear",
    description: "Warm woolen gloves ideal for cold weather and outdoor activities."
  },
  {
    name: "headphones",
    id: "1002342",
    img: "/assets/product image/Headphones.jpg",
    category: { Electronics: "audio" },
    price: 2499,
    seller: "SoundHub",
    description: "Over-ear headphones with noise cancellation and deep bass."
  },
  {
    name: "hoodie",
    id: "1002343",
    img: "/assets/product image/Hoodie.jpg",
    category: { Clothing: "winterwear" },
    price: 899,
    seller: "UrbanWear",
    description: "Stylish hoodie with fleece lining and adjustable hood."
  },
  {
    name: "iphone",
    id: "1002344",
    img: "/assets/product image/Iphone.jpg",
    category: { Electronics: "smartphones" },
    price: 69999,
    seller: "MobileMart",
    description: "Latest iPhone model with advanced camera and OLED display."
  },
  {
    name: "laptop",
    id: "1002345",
    img: "/assets/product image/Laptop.jpg",
    category: { Electronics: "computers" },
    price: 55999,
    seller: "TechBazaar",
    description: "Powerful laptop with 16GB RAM and 512GB SSD for multitasking."
  },
  {
    name: "mixer",
    id: "1002346",
    img: "/assets/product image/Mixer.jpg",
    category: { Appliances: "kitchen" },
    price: 3499,
    seller: "HomeEssentials",
    description: "Durable mixer grinder with multiple jars and speed settings."
  },
  {
    name: "pants",
    id: "1002347",
    img: "/assets/product image/Pants.jpg",
    category: { Clothing: "bottomwear" },
    price: 1099,
    seller: "StyleStreet",
    description: "Comfortable cotton pants suitable for casual and formal wear."
  },
  {
    name: "shoes",
    id: "1002348",
    img: "/assets/product image/Shoes.jpg",
    category: { Footwear: "sneakers" },
    price: 2799,
    seller: "ShoeMart",
    description: "Lightweight sneakers with breathable mesh and cushioned sole."
  },
  {
    name: "speakers",
    id: "1002349",
    img: "/assets/product image/Speakers.jpg",
    category: { Electronics: "audio" },
    price: 3999,
    seller: "SoundHub",
    description: "Bluetooth speakers with stereo sound and long battery life."
  },
  {
    name: "teddybear",
    id: "1002350",
    img: "/assets/product image/Teddy-Bear-Day.jpg",
    category: { Toys: "plushies" },
    price: 450,
    seller: "ToyShopIN",
    description: "Soft and cuddly teddy bear perfect for kids and gifting."
  },
  {
    name: "transformer",
    id: "1002351",
    img: "/assets/product image/tranformer.jpg",
    category: { Toys: "actionfigures" },
    price: 1299,
    seller: "ToyGalaxy",
    description: "Transforming robot toy with articulated limbs and accessories."
  },
  {
    name: "tv",
    id: "1002352",
    img: "/assets/product image/TV.jpg",
    category: { Electronics: "television" },
    price: 34999,
    seller: "ElectroWorld",
    description: "Smart LED TV with 4K resolution and voice control features."
  },
  {
    name: "watch",
    id: "1002353",
    img: "/assets/product image/Watch.jpg",
    category: { Accessories: "wristwear" },
    price: 2199,
    seller: "TimeZone",
    description: "Elegant wristwatch with analog display and leather strap."
  }
];
  


  const productGrid=document.getElementById("product-grid")

  let productRow=""

for(let i=0;i<products.length;i++){




   productRow +=` 
      <div class="product-card">
        <a href="/Store/${products[i].id}" >
            <img src="${products[i].img}" alt="Product image" class="product-image"/>
                <h3>${products[i].name}</h3>
                <p>₹ ${products[i].price}</p>
        </a>
          <button>Add to Cart</button>
      </div> `
  if(i%4==0){
    console.log("checkpoint")
    productGrid.innerHTML+=productRow
    console.log(productRow)
     productRow=""
  }
}









document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("tab-btn");
  const icon = document.getElementById("tab-icon");
  const sidebar = document.querySelector(".side-bar");

  if (!btn || !icon || !sidebar) {
    console.error("Missing required elements.");
    return;
  }



  btn.addEventListener("click", () => {
    // Toggle the class on the sidebar
    sidebar.classList.toggle("toggleSideBar");

   
    icon.classList.toggle("collapsed");

   
  });



});


