const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();
  e.preventDefault();
};

const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar elemen
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

// bagian keranjang chekout
let cart = [];
const buttons = document.querySelectorAll('.add-to-cart');

// Event Listener tombol "Belanja" 
buttons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'));
    const imgSource = btn.getAttribute('data-img');
    
    const card = btn.closest('.product-card');
    const productImg = card.querySelector('.product-image img');

    //animasi
    flyToCart(productImg, () => {
        addToCart(name, price, imgSource);
        const shoppingCart = document.querySelector('.shopping-cart');
        shoppingCart.classList.add('active'); 
    });
  });
});

// Fungsi Tambah Barang
function addToCart(name, price, img) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }
  updateCartUI();
}

// Fungsi Update Tampilan Keranjang
function updateCartUI() {
  shoppingCart.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">${rupiah(item.price)} x ${item.quantity}</div>
      </div>
      <i data-feather="trash-2" class="remove-item" onclick="removeItem(${index})"></i>
    `;
    shoppingCart.append(cartItem);
  });

  // jika keranjang tidak kosong
  if (cart.length > 0) {
    const totalContainer = document.createElement('div');
    totalContainer.className = 'cart-total';
    totalContainer.style.padding = '1rem';
    totalContainer.style.textAlign = 'center';
    totalContainer.style.borderTop = '1px dashed #333';
    totalContainer.style.marginTop = '1rem';
    
    // Tampilkan Total & Tombol Checkout
    totalContainer.innerHTML = `<h3 style="margin-bottom: 1rem;">Total: ${rupiah(totalPrice)}</h3>`;
    
    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = 'Checkout via WhatsApp';
    checkoutBtn.className = 'btn';
    checkoutBtn.style.width = '100%';
    checkoutBtn.style.marginTop = '10px';
    checkoutBtn.style.cursor = 'pointer';
    checkoutBtn.onclick = checkoutProcess; 

    totalContainer.appendChild(checkoutBtn);
    shoppingCart.append(totalContainer);
  
  } else {
    shoppingCart.innerHTML = '<h4 style="text-align:center; margin-top:3rem; font-weight:300;">Keranjang Belanja Kosong.</h4>';
  }
  feather.replace();
}

// Fungsi Hapus Barang
function removeItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Fungsi Kirim ke WhatsApp 
function checkoutProcess() {
  const phoneNumber = '6281805003822'; 
  if (cart.length === 0) {
    alert("Keranjang belanja masih kosong.");
    return;
  }

  let message = `Halo Admin Urban Sole, saya ingin memesan:\n\n`;
  let total = 0;

  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.name} - ${item.quantity}pcs - ${rupiah(item.price * item.quantity)}\n`;
    total += item.price * item.quantity;
  });

  message += `\nTotal: *${rupiah(total)}*`;
  message += `\n\nMohon info stok dan pembayarannya.`;

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.location.href = waUrl;
}

// Helper Rupiah
function rupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}


// BAGIAN MODAL BOX 
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');

const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-title');
const modalDesc = document.querySelector('.modal-desc');
const modalPrice = document.querySelector('.modal-price');

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    
    // Ambil Data dari Tombol Mata
    const imgSource = btn.getAttribute('data-img');
    const title = btn.getAttribute('data-title');
    const desc = btn.getAttribute('data-desc');
    const price = btn.getAttribute('data-price');
    
    // Tempel Data ke dalam Modal
    modalImg.src = imgSource;
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modalPrice.innerText = rupiah(price); 
    itemDetailModal.style.display = 'flex';
  };
});

document.querySelector('.modal .close-icon').onclick = (e) => {
  itemDetailModal.style.display = 'none';
  e.preventDefault();
};

window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = 'none';
  }
};
// animasi ke keranjang
function flyToCart(imageElement, callback) {
  const shoppingCartBtn = document.querySelector('#shopping-cart-button');
  const flyingImg = imageElement.cloneNode();
  flyingImg.classList.add('flying-img');
  
  // Posisi awal gambar
  const rect = imageElement.getBoundingClientRect();
  flyingImg.style.width = rect.width + 'px';
  flyingImg.style.height = rect.height + 'px';
  flyingImg.style.left = rect.left + 'px';
  flyingImg.style.top = rect.top + 'px';
  document.body.appendChild(flyingImg);
  const cartRect = shoppingCartBtn.getBoundingClientRect();
  
  // Mulai animasi
  setTimeout(() => {
    flyingImg.style.left = (cartRect.left + cartRect.width / 2 - 25) + 'px';
    flyingImg.style.top = (cartRect.top + cartRect.height / 2 - 25) + 'px';
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.opacity = '0.7';
  }, 10);
  setTimeout(() => {
    flyingImg.remove();
    if (callback) callback();
  }, 800);
}

// kontak ke Whatsapp
document.querySelector('#send-btn').onclick = (e) => {
  e.preventDefault();

  //data dari formulir HTML
  const inputName = document.querySelector('#contact-name').value;
  const inputEmail = document.querySelector('#contact-email').value;
  const inputPhone = document.querySelector('#contact-phone').value;

  if (inputName === '' || inputEmail === '' || inputPhone === '') {
    alert('Harap isi semua kolom formulir kontak.');
    return;
  }
  const myPhoneNumber = '6281805003822'; 
  let message = `Halo Admin Urban Sole, saya ingin bertanya:\n\n`;
  message += `Nama: ${inputName}\n`;
  message += `Email: ${inputEmail}\n`;
  message += `No HP: ${inputPhone}\n\n`;
  message += `Pesan: (Tulis pertanyaanmu di sini)`;

  const waUrl = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`;
  window.location.href = waUrl;
};