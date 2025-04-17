from django.db import models
from django.core import validators

from apps.business_app.models.category import Category
from apps.common.models import BaseModel


class Product(BaseModel):
    name = models.CharField(verbose_name="Nombre", max_length=200)
    category = models.ForeignKey(
        to=Category,
        verbose_name="Categoría",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    description = models.TextField(verbose_name="Descripción", null=True, blank=True)
    image = models.ImageField(verbose_name="Imagen", null=True, blank=True)

    quantity = models.PositiveIntegerField(verbose_name="Cantidad", default=0)

    sell_price = models.FloatField(
        verbose_name="Precio",
        validators=[validators.MinValueValidator(limit_value=0)],
    )
    weight = models.FloatField(
        verbose_name="Peso",
        validators=[validators.MinValueValidator(limit_value=0)],
    )

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return f"{self.name} ({self.category})"
