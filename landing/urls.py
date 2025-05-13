from django.conf import settings
from django.urls import re_path as url
from landing import views
from products import views as prodviews
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.urls import path

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^category/(?P<category_id>\w+)/$', views.categories, name='category'),
    url(r'^category/', views.categories, name='category'),
    url(r'^categories/', views.categoriespage, name='categories'),
    url(r'^checkout/$', views.checkout, name='checkout'),
    url(r'^register/$', views.register, name='register'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^logout/$', views.user_logout, name='logout'),
    path('', views.home, name='home'),  # Redirect to the home view
    path('register/', views.register, name='register'),  # Registration page
    path('login/', views.user_login, name='login'),  # Login page
    path('logout/', views.user_logout, name='logout'),  # Logout page
    path('order_confirmation/', views.order_confirmation, name='order_confirmation'),  # Order confirmation page


]




if settings.DEBUG:
    if settings.MEDIA_ROOT:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()


