from django.db import models

from apps.common.models import BaseModel


class ShippingType(BaseModel):
    name = models.CharField(verbose_name="Nombre", max_length=200)
    description = models.TextField(verbose_name="Descripción", null=True, blank=True)
    image = models.ImageField(verbose_name="Imagen", null=True, blank=True)

    min_weight_allowed = models.PositiveSmallIntegerField(
        verbose_name="Peso mínimo permitido"
    )
    price_by_weight_unit = models.FloatField(verbose_name="Precio por libra", null=True, blank=True)
    time_to_delivery=models.CharField(verbose_name="Tiempo para llegada de envío", max_length=100)

    class Meta:
        verbose_name = "Tipo de envío"
        verbose_name_plural = "Tipos de envíos"

    def __str__(self):
        return f"{self.name}"
