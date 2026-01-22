let userList= [
  {
  username: 'alice123',
  email: 'alice@example.com',
  password: '$2b$10$Z82meHPeRoOJ55ScD5pPcej.mdshewzIwZvBnkFLkGV8R0KOnlW8.',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 0
},
{
  username: 'bob456',
  email: 'bob@example.com',
  password: '$2b$10$Xi/LDY62YCV9L2TeaxX1veoRjmKn1sPsxddS34BsKmcCsRFpY6MNm',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 1
},
{
  username: 'charlie789',
  email: 'charlie@example.com',
  password: '$2b$10$eyo6rnkU9ujmUj.jvica0u/aUWg.0qqEGAnx8NTt5Nf.oY2DW6T6G',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 2
},
{
  username: 'diana321',
  email: 'diana@example.com',
  password: '$2b$10$TCKdwa9NeffzvrAm8EeAjOt6EPi8D7cXFgzk/8gD.wWlEVziujlK.',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 3
},
{
  username: 'edward654',
  email: 'edward@example.com',
  password: '$2b$10$rw6FRbL03mlZQvoh6p/viOZL7/3Bok72q0HdEZCNqNA/JBr3IkIR6',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 4
},
{
  username: 'adi',
  email: 'adawd',
  password: '$2b$10$5t/ry8QJR1C8vviYFfCtzO2Go9/oLqpY0UESQf2Li0Wg5BUppDpHu',
  createdAt: 'Thu Jan 22 2026',
  verfication: 0,
  myCart: null,
  myOrders: null,
  address: null,
  sellerVerification: 0,
  productListed: null,
  role: 'customerAccount',
  id: 5
}

]


let userListNotHashed = [
  {
    username: "alice123",
    email: "alice@example.com",
    password: "passAlice!",
    createdAt: "Thu Jan 22 2026",
    verification: 1,
    myCart: [],
    myOrders: [],
    address: "123 Main St, NY",
    sellerVerification: 0,
    productListed: [],
    role: "customerAccount"
  },
  {
    username: "bob456",
    email: "bob@example.com",
    password: "bobSecure99",
    createdAt: "Mon Feb 10 2025",
    verification: 0,
    myCart: null,
    myOrders: null,
    address: "456 Oak Ave, CA",
    sellerVerification: 0,
    productListed: null,
    role: "customerAccount"
  },
  {
    username: "charlie789",
    email: "charlie@example.com",
    password: "charliePwd77",
    createdAt: "Sat Mar 15 2024",
    verification: 1,
    myCart: ["item1", "item2"],
    myOrders: ["order1"],
    address: "789 Pine Rd, TX",
    sellerVerification: 1,
    productListed: ["productA"],
    role: "sellerAccount"
  },
  {
    username: "diana321",
    email: "diana@example.com",
    password: "dianaPass22",
    createdAt: "Wed Apr 20 2022",
    verification: 0,
    myCart: ["itemX"],
    myOrders: null,
    address: "321 Maple St, FL",
    sellerVerification: 0,
    productListed: null,
    role: "customerAccount"
  },
  {
    username: "edward654",
    email: "edward@example.com",
    password: "edwardKey88",
    createdAt: "Fri May 05 2023",
    verification: 1,
    myCart: [],
    myOrders: ["orderX", "orderY"],
    address: "654 Cedar Blvd, WA",
    sellerVerification: 1,
    productListed: ["productB", "productC"],
    role: "sellerAccount"
  }
];






let productsList = [
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
  

module.exports={productsList,userList}
