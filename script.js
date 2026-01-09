// ===== CART MANAGEMENT =====
let cart = JSON.parse(localStorage.getItem('aromadivinaCart')) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.cart-count');
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function saveCart() {
  localStorage.setItem('aromadivinaCart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productName, productPrice, productSize) {
  const existingItem = cart.find(item => item.name === productName && item.size === productSize);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(productPrice),
      size: productSize,
      quantity: 1
    });
  }
  
  saveCart();
  showNotification(`${productName} adăugat în coș!`, 'success');
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
  });
});

// ===== NEWSLETTER FORM =====
function handleNewsletter(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const email = emailInput.value;
  
  if (email && validateEmail(email)) {
    // Simulate API call
    showNotification('Mulțumim! Te-ai abonat cu succes. Verifică email-ul pentru codul de reducere 15%.', 'success');
    form.reset();
    
    // Store subscription in localStorage
    localStorage.setItem('newsletterSubscribed', 'true');
    localStorage.setItem('newsletterEmail', email);
  } else {
    showNotification('Te rugăm să introduci o adresă de email validă.', 'error');
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Make function globally accessible for inline HTML handler
window.handleNewsletter = handleNewsletter;

// ===== ADD TO CART BUTTONS =====
document.querySelectorAll('.btn-small').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const productCard = this.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent.replace(' RON', '').trim();
    const productSize = productCard.querySelector('.product-size').textContent;
    
    addToCart(productName, productPrice, productSize);
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== STICKY NAVBAR =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .benefit-card, .testimonial-card').forEach(el => {
  el.classList.add('animate-target');
  observer.observe(el);
});

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Show welcome message for first-time visitors
  if (!localStorage.getItem('visited')) {
    setTimeout(() => {
      showNotification('Bun venit la Aroma Divină! Cafea premium, prajită proaspăt.', 'success');
      localStorage.setItem('visited', 'true');
    }, 1000);
  }
  
  console.log('🔥 Aroma Divină - Site loaded successfully!');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}
