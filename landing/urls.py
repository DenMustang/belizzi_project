from django.conf import settings
from django.urls import re_path as url
from landing import views
from products import views as prodviews
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^category/(?P<category_id>\w+)/$', views.categories, name='category'),
    url(r'^category/', views.categories, name='category'),

    url(r'^categories/', views.categoriespage, name='categories'),


]

if settings.DEBUG:
    if settings.MEDIA_ROOT:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()


