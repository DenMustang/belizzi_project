from django.db import models
from django.utils.translation import gettext_lazy as _
from tinymce.models import HTMLField


class ProductCategory(models.Model):
    name = models.CharField(_('name'), max_length=64, blank=True, null=True, default=None)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = 'Product category'
        verbose_name_plural = 'Products categories'


class Product(models.Model):
    name = models.CharField(_('name'), max_length=86)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.ForeignKey(ProductCategory, blank=True, null=True, default=None, on_delete=models.CASCADE)
    description = HTMLField(_('description'))
    image = models.ImageField(default=None, upload_to='products_images/', blank=True, null=True)
    url = models.URLField(max_length=250, default=None, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.price}, {self.name}"

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products_images/')
    is_active = models.BooleanField(default=True)
    is_main = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def image_img(self):
        if self.image:
            return f'<img src="{self.image.url}" width="100px" />'
        return '(none)'

    image_img.short_description = 'Thumb'
    # image_img.allow_tags = True  # Deprecated in modern Django admin

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = "Фотографія"
        verbose_name_plural = "Фотографії"
