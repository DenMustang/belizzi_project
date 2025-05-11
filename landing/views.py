from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

from products.models import *


# User registration view
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful!')
            return redirect('home')  # Redirect to the homepage or another page
        else:
            messages.error(request, 'There was an error with your registration. Please try again.')
    else:
        form = UserCreationForm()
    return render(request, 'landing/register.html', {'form': form})


# User login view
def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')  # Redirect to the homepage after login
        else:
            messages.error(request, 'Invalid username or password. Please try again.')
    else:
        form = AuthenticationForm()
    return render(request, 'landing/login.html', {'form': form})



# User logout view
@login_required
def user_logout(request):
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login')  # Redirect to the login page after logout


LANGUAGE_SESSION_KEY = 'django_language'  # ✅ manually define it


def home(request):
    if not request.user.is_authenticated:
        return redirect('login')  # Redirect to login page if not authenticated

    # If authenticated, display the home page or another page
    category = ProductCategory.objects.filter(is_active=True)
    product_item = Product.objects.filter(is_active=True)

    return render(request, 'landing/home.html', locals())


def categories(request, category_id):
    category = ProductCategory.objects.filter(is_active=True)
    products = Product.objects.filter(category=category_id, is_active=True)

    session_key = request.session.session_key
    if not session_key:
        request.session.cycle_key()

    print(request.session.session_key)

    return render(request, 'landing/category.html', locals())


def categoriespage(request):
    category = ProductCategory.objects.filter(is_active=True)
    product_item = Product.objects.filter(is_active=True)

    if LANGUAGE_SESSION_KEY in request.session:
        del request.session[LANGUAGE_SESSION_KEY]

    return render(request, 'landing/categories.html', locals())


def checkout(request):
    # This view simply renders the checkout template
    # Cart content is handled by JavaScript on the client side

    return render(request, 'checkout.html', locals())
