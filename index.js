document.addEventListener('DOMContentLoaded', function() {
  
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
    
    renderCart(); // Re-render the cart to update quantities and buttons
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

  // --- VALIDATION & CONSTRAINTS ---

  // Name Input Control
  const nameInputs = [document.getElementById('card-name'), document.getElementById('nameInput')];
  nameInputs.forEach(input => {
    if(input) {
      input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, '');
      });
    }
  });

  // Card Number and Icon Control
  const cardInput = document.getElementById('card-number');
  const cardTypeIcon = document.getElementById('card-type-icon');
  if(cardInput) {
    cardInput.addEventListener('input', function(e) {
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
    });
  }

  // CVV (DÜZELTİLDİ: 3 karakterden fazlasını engellemek için kısıtlama eklendi)
  const cvvInput = document.getElementById('card-cvv');
  if(cvvInput) {
    cvvInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '').substring(0, 3); // Yalnızca rakamları tut ve 3 haneye kısıtla
    });
  }

  // Expiry Date Formatting
  const dateInput = document.getElementById('card-expiry');
  if(dateInput) {
    dateInput.addEventListener('input', function(e) {
      let value = this.value.replace(/\D/g, '');
      if (value.length >= 2) {
        // Ay kısmı 01-12 arasında değilse, 12'ye kısıtla (bu sadece formatlama, validasyon submit'te yapılır)
        let monthPart = parseInt(value.substring(0, 2), 10);
        if (monthPart > 12) {
            monthPart = 12; // 12'den büyükse 12 olarak göster
        }
        
        value = monthPart.toString().padStart(2, '0') + '/' + value.substring(2, 4);
      }
      this.value = value;
    });
  }
  
  // 5. PAYMENT FORM SUBMISSION (With Full Validation)
  const paymentForm = document.getElementById('payment-form');

  if(paymentForm){
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Submit anında input değerlerini tekrar al
      const submitCardInput = document.getElementById('card-number');
      const submitExpiryInput = document.getElementById('card-expiry'); 
      const submitCvvInput = document.getElementById('card-cvv'); 
      
      const rawCardNumber = submitCardInput.value.replace(/\s/g, ''); 
      const expiryValue = submitExpiryInput.value;
      
      // --- 1. Card Number Validation (16 digits) ---
      if (rawCardNumber.length !== 16) {
        alert("Please enter a valid 16-digit card number.");
        submitCardInput.focus();
        return; 
      }
      
      // --- 2. Expiry Date Validation (MM/YY) ---
      
      const parts = expiryValue.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      
      // Check format
      if (parts.length !== 2 || isNaN(month) || isNaN(year) || expiryValue.length !== 5) {
          alert("Please enter the expiry date in MM/YY format (e.g., 12/26).");
          submitExpiryInput.focus();
          return; 
      }
      
      // Check month (1-12)
      if (month < 1 || month > 12) {
          alert("The expiry month must be between 01 and 12.");
          submitExpiryInput.focus();
          return; 
      }

      // Year Validation
      const currentYear = new Date().getFullYear() % 100; // e.g., 2025 -> 25
      const currentMonth = new Date().getMonth() + 1; // 1-12
      
      // Check if expired year
      if (year < currentYear) {
          alert("The card has expired. Please check the expiry year.");
          submitExpiryInput.focus();
          return; 
      }
      
      // Check if expired month in current year
      if (year === currentYear && month < currentMonth) {
          alert("The card has expired. Please check the expiry month.");
          submitExpiryInput.focus();
          return; 
      }
      
      // --- 3. CVV Validation (3 digits) ---
      if (submitCvvInput.value.length !== 3) {
          alert("Please enter a valid 3-digit CVV/CVC.");
          submitCvvInput.focus();
          return; 
      }

      // If all controls pass, start the payment simulation
      const submitBtn = paymentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Processing...';
      submitBtn.disabled = true;

      // Successful payment simulation
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