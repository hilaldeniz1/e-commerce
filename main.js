// html'in yüklenme anı
document.addEventListener('DOMContentLoaded', fetchCategories);

// yaptığımız ,isteklerin tamamında buulunur:
const baseUrl = 'https://api.escuelajs.co/api/v1';

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

const categoryList = document.querySelector('.categories');

function renderCategories(categories) {
  // kategoriler dizisindeki herbir obje için çalışır
  categories.forEach((category) => {
    // 1- div oluşturma
    const categoryDiv = document.createElement('div');
    // 2- dive class ekleme
    categoryDiv.classList.add('category-card');
    // 3- divin içeriğini belirleme
    categoryDiv.innerHTML = `
    <img src=${category.image} />
    <p>${category.name}</p>
    `;
    // 4- elemanı htmlde categories div'ine ekleme
    categoryList.appendChild(categoryDiv);
  });
}