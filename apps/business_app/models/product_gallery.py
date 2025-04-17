from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.business_app.models.product import Product


class ProductGallery(models.Model):
    product = models.ForeignKey(
        to=Product,
        verbose_name="Product",
        on_delete=models.CASCADE,
        related_name="product_gallery_pictures",
    )
    picture = models.ImageField(verbose_name=_("Imagen"))

    extra_info = models.TextField(verbose_name="Extra Info", null=True, blank=True)

    class Meta:
        verbose_name = _("Galería de Producto")
        verbose_name_plural = _("Galería de productos")

    def __str__(self):
        return f"{self.product}"
