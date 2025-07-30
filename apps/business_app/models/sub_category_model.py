from django.db import models
from django.core import validators

from apps.business_app.models.category import Category


class SubCategory(models.Model):
    name = models.CharField(verbose_name="Nombre", max_length=250)
    extra_info = models.TextField(
        verbose_name="Información Extra", null=True, blank=True
    )
    price_by_weight = models.FloatField(
        verbose_name="Precio por libra",
        validators=[validators.MinValueValidator(limit_value=0)],
        null=True,
        blank=True,
    )
    super_category = models.ForeignKey(to=Category, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Subcategoría"
        verbose_name_plural = "Subcategorías"

    def __str__(self):
        return f"{self.name} ({self.super_category})"
