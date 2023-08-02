//! HTML'den gelenler
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");
const registerBtn = document.querySelector("#register-btn");
const registerSection = document.querySelector(".registers");
const ball = document.querySelector("#dark-mode-toggle");

// kayıt ol alanı
registerBtn.addEventListener("click", () => {
  registerSection.style.display = "block";
});

//! API işlemleri
//! HTML'in yükleme anı
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories(), fetchProducts();
});

// yaptığımız isteklerin url'sini değişkene tanıttık
const baseUrl = "https://api.escuelajs.co/api/v1";

//TODO  Kategori bilgilerini alma
// 1- Api'ye istek at
// 2- Gelen veriyi işle
// 3- Gelen verileri kart şeklinde ekrana basacak fonkstiyonu çalıştır
// 4- Cevap hatalı olursa kullanıcıyı bilgilendir.

//Todo kategoriler için istek atma
function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    // eğer cevap olumlu gelirse çalışır
    .then((res) => res.json())
    // veri JSON formayına dönünce çalışır
    .then((data) => renderCategories(data.slice(1, 5)))
    // cevapta hata varsa burası çalışır
    .catch((err) => console.log(err));
}

//Todo kategorileri ekrana basma
function renderCategories(categories) {
  // kategoriler dizisindeki her bir obje için ekrana kart basma
  categories.forEach((category) => {
    // 1- div oluşturma
    const categoryDiv = document.createElement("div");

    // 2- div'e class ekleme
    categoryDiv.classList.add("category-card");

    // 3- div'in içeriğini belirleme
    categoryDiv.innerHTML = `
        <img src=${category.image}>
        <p>${category.name}</p>
        `;

    // 4- elemanı HTML categories div'ine ekleme
    categoryList.appendChild(categoryDiv);
  });
}

//Todo ürünler için istek atma
async function fetchProducts() {
  try {
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(1, 26));
    // hata olursa yakalar
  } catch (err) {
    console.log(err);
  }
}

//Todo ürünleri ekrana basma
function renderProducts(products) {
  // her bir ürün için kart HTML'i oluştur ve diziye aktar
  const productsHTML = products
    .map(
      (product) => `
   <div class="card">
    <img src=${product.images[0]} alt="">
    <h4>${product.title}</h4>
    <h4>${product.category.name ? product.category.name : "Others"}</h4>
    <div class="action">
       <span>${product.price} $</span>
       <button onclick="addToBasket({id:${product.id},title:'${
        product.title
      }', price:${product.price}, img:'${
        product.images[0]
      }',amount:1})">Sepete Ekle</button>
    </div>
    </div>
    
   `
    )
    // dizi şeklindeki verinin virgüllerini kaldırarak string'e dönüştürür
    .join(" ");

  // Ürünler html'ini listeye gönderme
  productsArea.innerHTML += productsHTML;
}

// Sepet değişkenleri
let basket = [];
let total = 0;

//! Modal işlemleri
basketBtn.addEventListener("click", () => {
  // sepeti açma
  modal.classList.add("active");

  // Sepete ürünleri listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  // sepeti kapatma
  modal.classList.remove("active");
});

//! Basket(sepet) işlemleri
// sepete ekleme işlemi
function addToBasket(product) {
  // ürün sepete  daha önce eklendi mi?
  const found = basket.find((i) => i.id === product.id);
  // evet sepette var ve miktarı arttır
  if (found) {
    found.amount++;
  } else {
    // eleman sepette yok ve sepete ekle
    basket.push(product);
  }
}

// Sepete elemanları listeleme
function renderBasket() {
  const cardsHTML = basket
    .map(
      (product) => `
    <div class="item">
        <img src="${product.img}">
        <h3 class="title">${product.title}</h3>
        <h4 class="price">${product.price} $</h4>
        <p>Adet:${product.amount}</p>
        <img onclick="deleteItem(${product.id})" id="delete" src="images/e-trash.png.png">
    </div>
    `
    )
    .join(" ");

  // hazırladığımız kartları HTML'e gönderme
  basketList.innerHTML = cardsHTML;

  // sepet toplam değeri hesaplama
  calculateTotal();
}

// Sepet toplamı ayarlama
function calculateTotal() {
  // toplam fiyatı hesaplama
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  // ürün miktarını hesaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);

  // miktarı HTML'e gönderme
  totalCount.innerText = amount + " " + "Ürün";

  // toplam değeri HTML'e gönderme
  totalSpan.innerText = sum;
}

// Sepetten ürünü silme fonksiyonu
function deleteItem(deleteid) {
  // kaldırılacak ürün dışındaki bütün ürünleri alma
  basket = basket.filter((i) => i.id !== deleteid);

  // listeyi güncelleme
  renderBasket();

  // toplamı güncelleme
  calculateTotal();
}

// Kullanıcının karanlık mod tercihini kontrol edin
const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
const items = document.querySelectorAll(".toggle-btn::after");

// Karanlık ve açık mod arasında geçiş yapacak fonksiyon
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Toggle düğmesine tıklama olayı ekleme
ball.addEventListener("click", toggleDarkMode);
