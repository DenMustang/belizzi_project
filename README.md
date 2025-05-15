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

---

## 🚀 Getting Started

**1. Clone the repository**

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

**2. Install dependencies**

```
pip install -r requirements.txt
```

**3. Run migrations**

```
python manage.py migrate
```

**4. Create superuser (optional for admin access)**

```
python manage.py createsuperuser
```

**5. Start the development server**

```
python manage.py runserver
```

Now visit `http://127.0.0.1:8000/admin` to access the admin panel.

---

## 🧰 Technologies Used

- **Backend**: Django (Python)
- **Database**: SQLite3
- **Authentication**: Django's built-in user model
- **Admin Panel**: Django Admin

---

## 📁 Project Structure

your-repo/  
├── products/ – App for product models and views  
├── db.sqlite3 – SQLite database file  
├── manage.py – Django management script  
├── requirements.txt – Python dependencies  
└── README.md – You’re reading it!

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add your feature"`)  
4. Push to GitHub (`git push origin feature/your-feature`)  
5. Open a Pull Request

---

## 📃 License

This project is licensed under the **MIT License**. Use it freely for commercial or personal projects.
