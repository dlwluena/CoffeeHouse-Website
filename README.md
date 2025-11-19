# The Coffee House 

A modern, responsive website designed for a premium coffee shop experience. This project features a dynamic shopping cart system, smooth navigation, and a user-friendly checkout process with advanced form validations.

## Features

### Design & UX
- **Fully Responsive:** Built with **Bootstrap 5**, ensuring a perfect look on mobile, tablet, and desktop.
- **Smooth Scrolling:** Fixed navbar overlap issues using `scroll-padding-top` for a seamless navigation experience.
- **Coffee Themed UI:** Custom color palette (Dark Coffee, Cream, Beige) and typography (Playfair Display & Poppins).

### Shopping Cart Logic
- **Dynamic Cart:** Add items, increase/decrease quantities, or remove items instantly.
- **Auto-Calculation:** Real-time total price updates.
- **Offcanvas Menu:** A sleek side-menu for viewing cart contents without leaving the page.

### Enhanced Checkout Experience
- **Auto-Focus Inputs:** The cursor automatically jumps to the next field (Card Number -> Expiry -> CVV) for a faster checkout.
- **Mobile Optimization:** Triggers the **numeric keypad** on mobile devices for credit card inputs.
- **Smart Validation:** - Prevents invalid characters in name and card fields.
  - Auto-formats expiry date with a slash (`MM/YY`).
  - Dynamic card brand detection (Visa/Mastercard icons).

## Project Structure

```text
coffee-shop-site/
│
├── index.html          # Main HTML structure
├── style.css           # Custom styles and variables
├── index.js            # Cart logic, validations, and UI interactivity
├── icon.png            # Favicon file (Coffee Icon)
│
└── img/                # Image assets folder
    ├── americano.png
    ├── beans.jpg
    ├── espresso.png
    ├── hero-bg.jpg
    └── latte-art.png
```

## Technologies Used

HTML5 - Semantic structure.
CSS3 - Custom styling and variables.
JavaScript (ES6) - DOM manipulation, cart logic, and form validation.
Bootstrap 5.3 - Grid system, modals, and components.
Bootstrap Icons - For UI elements like cart, trash can, and credit card icons.

## How to Run
1. Clone the repository:
```bash
git clone [https://github.com/YOUR-USERNAME/coffee-shop-site.git](https://github.com/YOUR-USERNAME/coffee-shop-site.git)
```
2. Open index.html in your browser.
Recommended: Use Live Server in VS Code for the best experience


```
