document.addEventListener('DOMContentLoaded', function() {
  
  // --- FIX 1: CLOSE THE MENU WHEN CLICKING THE LINK --- 
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link'); 
  const navbarCollapse = document.getElementById('navbarNav'); 

  navLinks.forEach(link => { 
  link.addEventListener('click', () => { 
  if (navbarCollapse.classList.contains('show')) { 
  const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse); 
  if (bsCollapse) bsCollapse.hide(); 
  } 
  }); 
  }); 

  // --- FIX 2 (ADDED): CLOSE THE MENU WHEN SCROLLING ---
  window.addEventListener('scroll', function() {
  // If the menu is open (if the 'show' class is present)
  if (navbarCollapse.classList.contains('show')) {
  const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
  if (bsCollapse) {
  bsCollapse.hide();
  }
  }
  });
  // -------

  let cart = [];
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const btnCheckout = document.getElementById('btn-checkout'); 

  // Helper function to remove an item from the cart
  function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }

  // 1. ADD TO CART
  cartButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const id = event.target.getAttribute('data-id');
      const name = event.target.getAttribute('data-name');
      const img = event.target.getAttribute('data-img');
      const price = parseFloat(event.target.getAttribute('data-price'));
      addToCart(id, name, price, img);
    });
  });

  function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id: id, name: name, price: price, img: img, quantity: 1 });
    }
    renderCart();
  }

  // 2. RENDER CART (Shows Trash Icon when Quantity is 1)
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    // Remove items with quantity 0 before rendering
    cart = cart.filter(item => item.quantity > 0); 
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p id="empty-cart-msg" class="text-center mt-3">Your cart is currently empty.</p>';
    } else {
      
      let cartHtml = '';
      
      cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2); 

        // Decrement / Delete Button Logic
        let decrementButtonHtml;
        if (item.quantity > 1) {
            // Quantity > 1: Standard Decrement Button
            decrementButtonHtml = `<button class="btn btn-outline-secondary btn-decrease" type="button" data-id="${item.id}">-</button>`;
        } else {
            // Quantity == 1: Trash/Delete Button
            decrementButtonHtml = `<button class="btn btn-outline-danger btn-delete-item" type="button" data-id="${item.id}"><i class="bi bi-trash"></i></button>`;
        }

        const cartItemHTML = `
          <div class="card mb-3 shadow-sm" style="border:none; border-bottom:1px solid #eee;">
            <div class="row g-0 align-items-center">
              <div class="col-3 p-2">
                <img src="${item.img}" class="img-fluid rounded" style="width:100%; height:60px; object-fit:cover;" alt="${item.name}">
              </div>
              <div class="col-9">
                <div class="card-body py-2 pe-3 ps-0">
                  <div class="d-flex justify-content-between align-items-start">
                    <h6 class="card-title mb-1" style="font-size:0.95rem;">${item.name}</h6>
                    <span class="fw-bold" style="color: var(--primary-color);">$${itemTotal}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <small class="text-muted">$${item.price.toFixed(2)} / each</small>
                    <div class="input-group input-group-sm" style="width: 90px;">
                      ${decrementButtonHtml}
                      <span class="form-control text-center border-secondary px-0" style="background:#fff;">${item.quantity}</span>
                      <button class="btn btn-outline-secondary btn-increase" type="button" data-id="${item.id}">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        cartHtml += cartItemHTML;
      });
      cartItemsContainer.innerHTML = cartHtml;
    }
    updateCartTotal();
  }

  function updateCartTotal() {
    let total = 0;
    cart.forEach(item => { 
        total += item.price * item.quantity; 
    });
    cartTotalElement.innerText = total.toFixed(2);
  }

  // 3. QUANTITY CONTROLS (Handles Increase, Decrease, and Trash click)
  cartItemsContainer.addEventListener('click', function(event) {
    const target = event.target;
    
    // Find the clicked button
    const increaseButton = target.closest('.btn-increase');
    const decreaseButton = target.closest('.btn-decrease');
    const deleteButton = target.closest('.btn-delete-item'); 

    let actionButton = increaseButton || decreaseButton || deleteButton;
    if (!actionButton) return; 

    const id = actionButton.getAttribute('data-id');
    const itemToUpdate = cart.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    // Handle Increase
    if (actionButton.classList.contains('btn-increase')) {
      itemToUpdate.quantity++;
    } 
    // Handle Decrease (Quantity > 1 only)
    else if (actionButton.classList.contains('btn-decrease')) {
      if (itemToUpdate.quantity > 1) {
        itemToUpdate.quantity--;
      }
    }
    // Handle Delete (Trash Button click)
    else if (actionButton.classList.contains('btn-delete-item')) {
        removeItemFromCart(id); 
        return; 
    }
    
    renderCart(); 
  });

  // 4. CHECKOUT
  if(btnCheckout) {
    btnCheckout.addEventListener('click', function() {
      if (cart.length === 0) {
        alert("Your cart is empty! Please add some coffee first.");
        return;
      }
      const cartOffcanvasElement = document.getElementById('cartOffcanvas');
      const cartOffcanvasInstance = bootstrap.Offcanvas.getInstance(cartOffcanvasElement) || new bootstrap.Offcanvas(cartOffcanvasElement);
      cartOffcanvasInstance.hide();

      const currentTotal = document.getElementById('cart-total').innerText;
      document.getElementById('checkout-total-display').innerText = "$" + currentTotal;

      const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
      checkoutModal.show();
    });
  }

  // --- VALIDATION & CONSTRAINTS & UX IMPROVEMENTS ---

  const inputCard = document.getElementById('card-number');
  const inputExpiry = document.getElementById('card-expiry');
  const inputCvv = document.getElementById('card-cvv');

  // Name Input Control
  const nameInputs = [document.getElementById('card-name'), document.getElementById('nameInput')];
  nameInputs.forEach(input => {
    if(input) {
      input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, '');
      });
    }
  });

  // Card Number Formatting & UX
  const cardTypeIcon = document.getElementById('card-type-icon');
  if(inputCard) {
    inputCard.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.substring(0, 16);
      let formattedValue = (value.match(/.{1,4}/g) || []).join(' ');
      e.target.value = formattedValue;

      // Icon Change
      if(cardTypeIcon) {
        let iconClass = '';
        if (value.startsWith('4')) { iconClass = 'bi-visa text-primary fs-4'; }
        else if (value.startsWith('5')) { iconClass = 'bi-mastercard text-danger fs-4'; }
        else { iconClass = ''; }
        cardTypeIcon.innerHTML = iconClass ? `<i class="bi ${iconClass}"></i>` : '';
      }

      // UX: Auto-Focus to Expiry Date
      if (e.target.value.length === 19) {
        if(inputExpiry) inputExpiry.focus();
      }
    });
  }

  // CVV Control
  if(inputCvv) {
    inputCvv.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '').substring(0, 3); 
    });
  }

  // Expiry Date Formatting & UX
  if(inputExpiry) {
    inputExpiry.addEventListener('input', function(e) {
      const inputType = e.inputType; // Silme işlemi mi kontrol et
      let value = this.value.replace(/\D/g, ''); // Sadece rakamları al
      
      // Otomatik slash (/) ekleme
      if (value.length >= 2 && inputType !== 'deleteContentBackward') {
         let month = value.substring(0, 2);
         let year = value.substring(2, 4);
         
         // Ay 12'den büyükse 12 yapma validasyonu (isteğe bağlı görsel düzeltme)
         if(parseInt(month) > 12) month = '12';

         value = month + (value.length > 2 ? '/' + year : '');
      }
      
      this.value = value;

      // UX: Auto-Focus to CVV
      if (this.value.length === 5) {
        if(inputCvv) inputCvv.focus();
      }
    });
  }
  
  // 5. PAYMENT FORM SUBMISSION
  const paymentForm = document.getElementById('payment-form');

  if(paymentForm){
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitCardInput = document.getElementById('card-number');
      const submitExpiryInput = document.getElementById('card-expiry'); 
      const submitCvvInput = document.getElementById('card-cvv'); 
      
      const rawCardNumber = submitCardInput.value.replace(/\s/g, ''); 
      const expiryValue = submitExpiryInput.value;
      
      // --- Validations ---
      if (rawCardNumber.length !== 16) {
        alert("Please enter a valid 16-digit card number.");
        submitCardInput.focus();
        return; 
      }
      
      const parts = expiryValue.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      
      if (parts.length !== 2 || isNaN(month) || isNaN(year) || expiryValue.length !== 5) {
          alert("Please enter the expiry date in MM/YY format (e.g., 12/26).");
          submitExpiryInput.focus();
          return; 
      }
      if (month < 1 || month > 12) {
          alert("The expiry month must be between 01 and 12.");
          submitExpiryInput.focus();
          return; 
      }

      const currentYear = new Date().getFullYear() % 100; 
      const currentMonth = new Date().getMonth() + 1; 
      
      if (year < currentYear) {
          alert("The card has expired. Please check the expiry year.");
          submitExpiryInput.focus();
          return; 
      }
      if (year === currentYear && month < currentMonth) {
          alert("The card has expired. Please check the expiry month.");
          submitExpiryInput.focus();
          return; 
      }
      
      if (submitCvvInput.value.length !== 3) {
          alert("Please enter a valid 3-digit CVV/CVC.");
          submitCvvInput.focus();
          return; 
      }

      // Simulation
      const submitBtn = paymentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Processing...';
      submitBtn.disabled = true;

      setTimeout(function() {
        const checkoutModalEl = document.getElementById('checkoutModal');
        const checkoutModalInstance = bootstrap.Modal.getInstance(checkoutModalEl);
        checkoutModalInstance.hide();

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        cart = [];
        renderCart();
        updateCartTotal();
        paymentForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});