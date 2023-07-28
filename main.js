//  html den gelenler
const categoryList = document.querySelector(".categories");
const productsArea = document.querySelector(".products");
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");

// !apı ıslemlerı
// html'in yüklenme anı
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

// yaptığımız ,isteklerin tamamında buulunur:
const baseUrl = "https://api.escuelajs.co/api/v1";

/*
 * kategori bilgilerini alma
 * 1- Api'ye istek at
 * 2- gelen veriyi işle
 * 3- gelen verileri kart şeklinde ekrana basıcak fonksiyonu çalıştır
 * 4- cevab hatalı olursa kullanıcıyı bilgilendir
 */

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    // eğerki cevapolumlu gelirse çalışır
    .then((res) => res.json())
    // veri json formatına dönünce çalışır
    .then((data) => renderCategories(data.slice(1, 5)))
    // cevapta hata varsa çalışır
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  // kategoriler dizisindeki herbir obje için çalışır
  categories.forEach((category) => {
    // 1- div oluşturma
    const categoryDiv = document.createElement("div");

    // 2- dive class ekleme
    categoryDiv.classList.add("category-card");
    // 3- divin içeriğini belirleme
    categoryDiv.innerHTML = `
    <img src=${category.image} />
    <p>${category.name}</p>
    `;
    // 4- elemanı htmlde categories div'ine ekleme
    categoryList.appendChild(categoryDiv);
  });
}

// ürünler icin istek at
async function fetchProducts() {
  try {
    // istegi atar
    const res = await fetch(`${baseUrl}/products`);
    const data = await res.json();
    renderProducts(data.slice(0, 25));
  } catch (err) {
    // hata olursa yakalar
    console.log(err);
  }
}

// ürünleri ekrana basar
function renderProducts(products) {
  // her bir ürün icin kart html i olustur ve diziye aktar
  const productsHTML = products
    .map(
      (product) => `
 <div class="card">
 <img src=${product.images[0]} >
 <h4>${product.title}</h4>
 <h4>${product.category.name ? product.category.name : "Diğer"}</h4>
 <div class="action">
   <span>${product.price} &#8378;</span>
   <button onclick="addToBasket(
    {id:${product.id},title:'${product.title}',price:${product.price},img:'${
        product.images[0]
      }',amount:1})">Sepete Ekle</button>
 </div>
</div>
 `
    )
    //  dizi seklindeki veriyi virgülleri kaldırarak stringe donusturur
    .join(" ");
  // ürünler html ini listeye gönder
  productsArea.innerHTML += productsHTML;
}

// sepet degişkenleri
let basket = [];
let total = 0;

//! modal işlemleri
basketBtn.addEventListener("click", () => {
  // sepeti acma
  modal.classList.add("active");
  // sepete ürünleri listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  // sepeti kapatma
  modal.classList.remove("active");
});

// ! sepet işlemleri

// seppete ekleme işlemi
function addToBasket(product) {
  // ürün sepete daha önce eklendi mi ?
  const found = basket.find((i) => i.id === product.id);

  if (found) {
    // eleman sepette var > miktarı arttır
    found.amount++;
  } else {
    // eleman sepette yok > sepete ekle

    basket.push(product);
  }
  console.log(basket);
}

// sepete elemanları listeleme
function renderBasket() {
  // kartları olusturma
  const cardsHTML = basket
    .map(
      (product) => ` <div class="item">
  <img src=${product.img} />
  <h3 class="title">${product.title}</h3>
  <h4 class="price">${product.price} &#8378;</h4>
  <p>Miktar: ${product.amount}</p>
  <img onclick="deleteItem(${product.id})" id="delete" src="/images/e-trash.png.png" />
</div>
  
  `
    )
    .join(" ");

  // hazırladıgımız kartları html e gonderme
  basketList.innerHTML = cardsHTML;
  // sepeti toplam degeri hesapla
  calculateTotal();
}

// sepette toplam bölümünü ayarlama
function calculateTotal() {
  // toplam fiyatı hesaplama
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  // ürün miktarını hesaplama
  const amount = basket.reduce((sum, i) => sum + i.amount, 0);

  // miktarı html e gonderme
  totalCount.innerText = amount + " " + "Ürün";

  // toplam degeri html e gonderme
  totalSpan.innerText = sum;
}

// sepetten ürünü silme fonksiyonu
function deleteItem(deleteid) {
  // kaldırılacak ürün dısındakı butun urunlerı al
  basket = basket.filter((i) => i.id !== deleteid);

  // listeyi güncelle
  renderBasket();

  // toplamı guncelle
  calculateTotal();
}
