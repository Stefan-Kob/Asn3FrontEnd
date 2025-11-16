const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Replace with your Spring Boot Render URL
const API_BASE = "https://your-springboot-backend.onrender.com";

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
    res.render("cart.ejs", { cart });
});

// Delete from cart
app.post("/remove", async (req, res) => {
    const { id } = req.body;
    await fetch(`${API_BASE}/cart/${id}`, { method: "DELETE" });
    res.redirect("/cart");
});

app.listen(PORT, () => console.log(`Frontend running http://localhost:${PORT}`));
