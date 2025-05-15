import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Belizzi.settings')
django.setup()

from products.models import ProductCategory, Product

def populate():
    # Create product categories
    pizza_category = ProductCategory.objects.create(name='Pizza', is_active=True)
    burger_category = ProductCategory.objects.create(name='Burger', is_active=True)
    dessert_category = ProductCategory.objects.create(name='Dessert', is_active=True)
    drink_category = ProductCategory.objects.create(name='Drink', is_active=True)
    
    # Create products
    # Pizzas
    Product.objects.create(
        name='Margherita',
        price=10.99,
        category=pizza_category,
        description='Classic pizza with tomato sauce, mozzarella cheese, and basil',
        is_active=True
    )
    
    Product.objects.create(
        name='Pepperoni',
        price=12.99,
        category=pizza_category,
        description='Pizza with tomato sauce, mozzarella cheese, and pepperoni',
        is_active=True
    )
    
    # Burgers
    Product.objects.create(
        name='Classic Burger',
        price=9.99,
        category=burger_category,
        description='Beef patty with lettuce, tomato, onion, and special sauce',
        is_active=True
    )
    
    Product.objects.create(
        name='Cheeseburger',
        price=11.99,
        category=burger_category,
        description='Beef patty with cheddar cheese, lettuce, tomato, onion, and special sauce',
        is_active=True
    )
    
    # Desserts
    Product.objects.create(
        name='Chocolate Cake',
        price=6.99,
        category=dessert_category,
        description='Rich chocolate cake with chocolate frosting',
        is_active=True
    )
    
    # Drinks
    Product.objects.create(
        name='Cola',
        price=2.99,
        category=drink_category,
        description='Refreshing cola drink',
        is_active=True
    )
    
    Product.objects.create(
        name='Orange Juice',
        price=3.99,
        category=drink_category,
        description='Freshly squeezed orange juice',
        is_active=True
    )
    
    print("Sample data has been populated!")

if __name__ == '__main__':
    print("Starting population script...")
    populate() 