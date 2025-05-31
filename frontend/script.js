const BACKEND_URL = "https://zone51-backend.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsAndRenderCategories();
});

function fetchProductsAndRenderCategories() {
  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(products => {
      window.allProducts = products; // Cache globally to avoid refetching
      renderCategories(products);
    })
    .catch(error => {
      console.error("Failed to load products:", error);
      const container = document.getElementById("product-container");
      container.innerHTML = "<p>Could not load product data.</p>";
    });
}

function renderCategories(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.setAttribute("data-category", category);

    btn.innerHTML = `
      <img src="assets/images/${formatImageName(category)}.png" alt="${category}" class="images" />
      <span>${category}</span>
    `;

    btn.addEventListener("click", () => {
      const filtered = products.filter(p => p.category === category);
      renderProducts(filtered);
    });

    container.appendChild(btn);
  });
}

function renderProducts(productList) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  // Back to Categories button
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Categories";
  backBtn.style.marginBottom = "1em";
  backBtn.addEventListener("click", () => {
    renderCategories(window.allProducts);
  });
  container.appendChild(backBtn);

  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>R${product.price.toFixed(2)}</strong></p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(id) {
  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      if (!product) return alert("Product not found");

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart`);
    })
    .catch(err => {
      console.error("Error adding to cart:", err);
      alert("Could not add to cart.");
    });
}

// Helper function to format category names to image filenames
function formatImageName(category) {
  return category.toLowerCase()
    .replace(/ & /g, '')    // remove " & "
    .replace(/\s+/g, '')    // remove spaces
    .replace(/[^\w]/g, ''); // remove special chars
}

// Star animation code (kept as you had it)
const starsContainer = document.querySelector('.stars');

function createStar() {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.animationDuration = `${Math.random() * 5 + 5}s`;
  starsContainer.appendChild(star);
  setTimeout(() => star.remove(), 10000);
}

setInterval(createStar, 150);
