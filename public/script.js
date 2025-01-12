let products = JSON.parse(localStorage.getItem("products")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
const productsContainerEl = document.querySelector(".products");

async function getAllProducts() {
    const url = "http://localhost:5000/api/products/all"
    try {
        const response = await fetch(url)
        const data = await response.json()
        updateDataAsLocal(data);
        renderProductCard();
    } catch (error) {
        console.log(error.message);
    }
}

function renderProductCard() {
    products.forEach(product => {
        const productCardHTML = `
            <div class="product-card" id="${product.id}">
                <img src="${product.image}" alt="product-1">
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <p>${product.des}</p>
                    <div class="product-card-action">
                        <button class="add-btn">Add</button>
                        <button class="like-btn ${product.isLiked ? "like": "" }">${product.isLiked ? "Liked": "Like"}</button>
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
                updateLike(productId, event.target.classList.contains("like"))
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
        setLikedProductsToLocalStorage(likedProducts)
   } else {
        product.isLiked = isLiked 
        likedProducts = [...likedProducts, product]
        setLikedProductsToLocalStorage(likedProducts)
   }
}

function setLikedProductsToLocalStorage(products) {
    localStorage.setItem("liked", JSON.stringify(products))
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
}


getAllProducts();