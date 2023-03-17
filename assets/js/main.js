async function getProduct(){
    try {
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/')
        const res = await data.json();
        window.localStorage.setItem("products",JSON.stringify(res))
        return res
    } catch (error) {
        console.log(error);
    }
}
function printProducts(db){
    let html = ""
    const productsHTML = document.querySelector(".products")
    for(let product of db.products){
        const buttonAdd = product.quantity ? `<i class='bx bx-plus' id=${product.id}></i>` : "<span class='soldOut'>sold out</span>";
        html += `
        <div class="product">
            <div class="product__img">
                <img src="${product.image}" alt="no cargo la imagen">
            </div>
            <div class="product__info">
                <h5>
                    $${product.price}.00<span>Stock: ${product.quantity}</span>
                    ${buttonAdd}
                </h5>
                <h4>${product.name}</h4>
            </div>          
        </div>
        `;
    }
    productsHTML.innerHTML = html
}
function handleShowCart(){
    const cartIcon = document.querySelector('.bx-cart');
    const closeCart = document.querySelector('.bxs-x-circle');
    const cartDisplay = document.querySelector('.cart');
    cartIcon.addEventListener('click', function(){
        cartDisplay.classList.toggle('cart__show')
    })
    closeCart.addEventListener('click', function(){
        cartDisplay.classList.toggle('cart__show')
    })
}
function addToCart(db){
    const elements = document.querySelector('.products')
    const checkClick = elements.addEventListener('click',function(e){
        if(e.target.classList.contains('bx-plus')){
            const id = Number(e.target.id);
            const productFind = db.products.find((product) => product.id === id);
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount) 
                return alert('no tenemos mas en bodega')

                db.cart[productFind.id].amount++;
            }else{
                db.cart[productFind.id] = {...productFind, amount:1};
            }
            console.log(db.cart)
            localStorage.setItem('cart', JSON.stringify(db.cart))
            printProductsCart(db)
            printTotal(db)
            counterInCartIcon(db)
        };
    })

}
function printProductsCart(db){
    const cartProducts = document.querySelector('.cart__products')
    let html = "";
    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount} = db.cart[product]
        html +=`
        <div class="cart__product" id=${id}>
            <div class="cart__product--img">
                <img src="${image}" alt="">
            </div>
            <div class="cart__product--body">
                <h4>${name}</h4>
                <p>Stock: ${quantity} | $${price}</p>
                <div class="cart__product--body-op" id=${id}>
                    <i class='bx bx-minus'></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash'></i>
                </div>
            </div>
        </div>  
        `
    }
    cartProducts.innerHTML = html;
}
function handleCartProducts(db){
    const cartProducts = document.querySelector('.cart__products')
    cartProducts.addEventListener('click', function(e){
        if(e.target.classList.contains('bx-plus')){
            const id = Number(e.target.parentElement.id)
            const productFind = db.products.find(product => product.id === id)

            if(productFind.quantity === db.cart[id].amount) return alert('there is not more items in stock');
            else{
                db.cart[id].amount++;
            }
            
        }
        if(e.target.classList.contains('bx-minus')){
            const id = Number(e.target.parentElement.id)
            if(db.cart[id].amount === 1){
                const response = confirm('¿are you sure to remove this item?')
                if(!response) return; 
                delete db.cart[id];
                
           }else{
                db.cart[id].amount--;
           }
            
        }
        if(e.target.classList.contains('bx-trash')){
            const id = Number(e.target.parentElement.id)
            const response = confirm('¿are you sure to remove this item?')
            if(!response) return;
            delete db.cart[id];
            
        }
        localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsCart(db)
        printTotal(db)
        counterInCartIcon(db)
    });
}
function printTotal(db){
    const infoTotal = document.querySelector('.info__total')
    const infoAmount = document.querySelector('.info__amount')
    let totalProducts = 0;
    let amountProducts = 0;
    for (const product in db.cart) {
        const{amount, price} = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }
    infoTotal.textContent = totalProducts
    infoAmount.textContent = amountProducts
}
function handleTotal(db){
    const btnBuy = document.querySelector('.btn__buy')
    btnBuy.addEventListener('click', function(){
        if(!Object.values(db.cart).length){
            return alert('you must have at least 1 item in the cart');
        };
        const response = confirm('¿are you sure you want to buy?');
        if(!response) return;
        const currentProducts = [];

        for(const product of db.products){
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product, quantity: product.quantity - productCart.amount
                });
            }else{
                currentProducts.push(product)
            }
        }
        db.products = currentProducts
        db.cart = {}
        localStorage.setItem('products', JSON.stringify(db.products))
        localStorage.setItem('cart', JSON.stringify(db.cart))
        printTotal(db)
        printProductsCart(db)
        printProducts(db)
        counterInCartIcon(db)
    })
}
function counterInCartIcon(db){
    const amountProducts = document.querySelector('.amountProducts')
    let amount = 0
    for (const key in db.cart) {
        amount += db.cart[key].amount
    }
    amountProducts.textContent = amount

}
function headerShadow(){
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        header.style.backgroundColor = '#fff';
        header.style.height = "60px";
    } else {
        header.style.backgroundColor = 'transparent';
        header.style.height = "50px";
    }
    });
}
function handleMenu(){
    const menu = document.querySelector('.bxs-dashboard');
    const closeMenu = document.querySelector('.bx-x');
    const displayMenu = document.querySelector('.menu');
    const home = document.querySelector('.homeLink');
    const products = document.querySelector('.productLink');
    menu.addEventListener('click', function(){
        displayMenu.classList.toggle('menu__show')
    })
    closeMenu.addEventListener('click', function(){
        displayMenu.classList.toggle('menu__show')
    })
    home.addEventListener('click', function(){
        displayMenu.classList.toggle('menu__show')
    })
    products.addEventListener('click', function(){
        displayMenu.classList.toggle('menu__show')
    })

}
async function main (){
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || await getProduct(),
        cart: JSON.parse(localStorage.getItem('cart')) || {},
    }
    
    headerShadow()
    printProducts(db)
    handleShowCart()
    addToCart(db)
    printProductsCart(db)
    handleCartProducts(db)
    printTotal(db)
    handleTotal(db)
    counterInCartIcon(db)
    handleMenu()
    
}

main();