# 🛒 E-Commerce Django Backend

A modular and extensible e-commerce backend powered by **Django** and **SQLite3**, supporting core features like product listings, categories, images, shopping carts, and user authentication.

## 📌 Features

- ✅ User authentication and permissions (via Django `auth`)
- 🛍️ Product listings with categories and images
- 🛒 Shopping cart and cart item logic
- 📸 Product image management
- ⚙️ Admin management via Django Admin
- 🧪 SQLite database for easy local development

## 🧱 Database Structure (ER Diagram)

Here’s a simple schema showing relationships between main entities:

ProductCategory  
 └── Product  
   └── ProductImage  

Cart  
 └── CartItem  
   └── Product  

User (auth_user) is a separate built-in Django model.

---

**ProductCategory**  
- `id` (PK)  
- `name`  
- `is_active`  

**Product**  
- `id` (PK)  
- `name`  
- `price`  
- `description`  
- `image`  
- `url`  
- `is_active`  
- `created`, `updated`  
- `category_id` (FK → ProductCategory)

**ProductImage**  
- `id` (PK)  
- `image`  
- `is_active`, `is_main`  
- `created`, `updated`  
- `product_id` (FK → Product)

**Cart**  
- `id` (PK)  
- `created`, `updated`

**CartItem**  
- `id` (PK)  
- `quantity`  
- `created`, `updated`  
- `cart_id` (FK → Cart)  
- `product_id` (FK → Product)

**auth_user** (built-in Django model)  
- `id` (PK)  
- `username`, `email`, `password`, etc.

