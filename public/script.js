let products = JSON.parse(localStorage.getItem("products")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
const productsContainerEl = document.querySelector(".products");

const showLikedProductsBtn = document.querySelector(".liked-item-show-btn")
const showCartItemBtn =  document.querySelector(".cart-item-show-btn")
const homeBtn = document.getElementById("home");

homeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    showingCart = false;
    showingLiked = false;
    console.log(window.location.assign("/"))
})

let showingCart = false;
let showingLiked = false;

showCartItemBtn.addEventListener("click", () => {
    if (!showingCart) {
        showingCart = true
        showingLiked = false;
        productsContainerEl.innerHTML = ""
    
        renderProductCard(cartProducts);
    }
})

showLikedProductsBtn.addEventListener("click", () => {
    if (!showingLiked) {
        showingLiked = true;
        showingCart = false;
        productsContainerEl.innerHTML = ""

        renderProductCard(likedProducts);
    }
})

async function getAllProducts() {
    const url = "http://localhost:5000/api/products/all"
    try {
        const response = await fetch(url)
        const data = await response.json()
        updateDataAsLocal(data);
        renderProductCard(products);

    } catch (error) {
        console.log(error.message);
    }
}

function renderProductCard(products) {
    if (!products.length) {
        productsContainerEl.innerHTML = "<p>No products is found<p>"
    }
    products.forEach(product => {
        const productCardHTML = `
            <div class="product-card" id="${product.id}">
                <img src="${product.image}" alt="product-1">
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <p>${product.des}</p>
                    <div class="product-card-action">
                        <button class="add-btn ${product.isAdded === true ? "add" : ""}">${product.isAdded === true ? "Remove" : "Add"}</button>
                        <button class="like-btn ${product.isLiked === true ? "like": ""}">${product.isLiked === true ? "Liked": "Like"}</button>
                    </div>
                </div>
            </div>
        `;
        productsContainerEl.innerHTML += productCardHTML;
    })

    addEventListenerToButtons(document.querySelectorAll(".add-btn"), "add")
    addEventListenerToButtons(document.querySelectorAll(".like-btn"), "like")
}

function addEventListenerToButtons(buttons, btnName) {
    buttons.forEach((button) => {
        if (btnName === "add") {
            button.addEventListener("click", (event) => {
                if (!event.target.classList.contains("add")) {
                    event.target.classList.add("add")
                    event.target.textContent = "Remove"
                } else {
                    event.target.classList.remove("add")
                    event.target.textContent = "Add"
                }
                const productId = event.target?.parentNode?.parentNode?.parentNode?.id;
                const isAdded = event.target.classList.contains("add")
                updateCart(productId, isAdded)
                
                if (showingCart && !isAdded) {
                    event.target?.parentNode?.parentNode?.parentNode.remove();
                }

            }, false);
        } else if (btnName === "like") {
            button.addEventListener("click", (event) => {
                if (!event.target.classList.contains("like")) {
                    event.target.classList.add("like")
                    event.target.textContent = "Liked"
                } else {
                    event.target.classList.remove("like")
                    event.target.textContent = "Like"
                }

                const productId = event.target?.parentNode?.parentNode?.parentNode?.id;
                const isLiked = event.target.classList.contains("like")

                updateLike(productId, isLiked)

                if (showingLiked && !isLiked) {
                    event.target?.parentNode?.parentNode?.parentNode.remove()
                }
            }, false);
        }
    })
}

function updateLike(productId, isLiked) {
   const product = products.find(product => product.id === productId)
   const inLiked = likedProducts.find(product => product.id === productId)
   if (!isLiked && inLiked) {
        const newLiked = likedProducts.filter(product => product.id !== inLiked.id)
        likedProducts = newLiked
        setCartOrLikedProductToLocalStorage("liked", likedProducts)
   } else {
        product.isLiked = isLiked 
        likedProducts = [...likedProducts, product]
        setCartOrLikedProductToLocalStorage("liked", likedProducts)
   }
}

function updateCart(productId, isAdded) {
   const product = products.find(product => product.id === productId)
   const inCart = cartProducts.find(product => product.id === productId)

   if (!isAdded && inCart) {
        const newCart = cartProducts.filter(product => product.id !== inCart.id)
        cartProducts = newCart
        setCartOrLikedProductToLocalStorage("cart", cartProducts)
   } else {
        product.isAdded = isAdded; 
        cartProducts = [...cartProducts, product]
        setCartOrLikedProductToLocalStorage("cart", cartProducts)
   }
}

function setCartOrLikedProductToLocalStorage(storeName, products) {
    localStorage.setItem(storeName, JSON.stringify(products))
}

function updateDataAsLocal(data) {
    products = data.map(dt => {
        const likedProduct = likedProducts.find((liked) => dt.id === liked.id)
        if (!likedProduct) {
            return dt
        } else {
            return likedProduct;
        }
    })

    products = products.map(dt => {
        const cartProduct = cartProducts.find((item) => dt.id === item.id)
        if (!cartProduct) {
            return dt
        } else {
            return cartProduct;
        }
    })
}

if (!showingCart && !showingLiked) getAllProducts();