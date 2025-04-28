from django.contrib import admin
from .models import *


# class ProductImageInline(admin.TabularInline):
#     model = ProductImage
#     extra = 0


class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductCategory._meta.fields]

    class Meta:
        model = ProductCategory

admin.site.register(ProductCategory, ProductCategoryAdmin)

class ProductAdmin (admin.ModelAdmin):
    list_display = ['name','price','category','is_active']
    # inlines = [ProductImageInline]
    list_filter = ['category']

    class Meta:
        model = Product

admin.site.register(Product, ProductAdmin)


# class ProductImageAdmin (admin.ModelAdmin):
#     list_display = [field.name for field in ProductImage._meta.fields]
#
#     class Meta:
#         model = ProductImage
#
# admin.site.register(ProductImage, ProductImageAdmin)