const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Base API URL
const API_BASE = "https://cloud-native-assignment-latest.onrender.com";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Render products page
app.get("/", async (req, res) => {
    const products = await fetch(`${API_BASE}/products`).then(r => r.json());
    res.render("index.ejs", { products });
});

// Add to cart
app.post("/addtocart", async (req, res) => {
    const { id } = req.body;

    await fetch(`${API_BASE}/cart?productId=${id}&quantity=1`, {
        method: "POST"
    });

    res.redirect("/");
});

// Render cart page
app.get("/cart", async (req, res) => {
    const cart = await fetch(`${API_BASE}/cart`).then(r => r.json());
    const products = await fetch(`${API_BASE}/products`).then(r => r.json());

    // Join cart items with product details
    const cartWithDetails = cart.map(item => {
        const product = products.find(p => p.id === item.productId);

        return {
            ...item,
            name: product?.name,
            description: product?.description,
            price: product?.price,
            image: product?.image
        };
    });

    res.render("cart.ejs", { cart: cartWithDetails });
});

// Empty cart
app.post("/emptycart", async (req, res) => {
    await fetch(`${API_BASE}/emptycart`, { method: "DELETE" });

    res.redirect("/cart");
});

// Delete from cart
app.post("/remove", async (req, res) => {
    const { id } = req.body;
    await fetch(`${API_BASE}/cart/${id}`, { method: "DELETE" });
    res.redirect("/cart");
});

app.listen(PORT, () => console.log(`Frontend running http://localhost:${PORT}`));
