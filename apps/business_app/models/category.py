from django.db import models
from django.core import validators


class Category(models.Model):
    name = models.CharField(verbose_name="Nombre", unique=True, max_length=250)
    extra_info = models.TextField(
        verbose_name="Información Extra", null=True, blank=True
    )
    price_by_weight = models.FloatField(
        verbose_name="Precio por libra",
        validators=[validators.MinValueValidator(limit_value=0)],
    )
    in_cuba = models.BooleanField(verbose_name="En Cuba", default=False)
    priced_per_unit = models.BooleanField(
        verbose_name="Precio fijo por unidad", default=False
    )

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return f"{self.name}"
