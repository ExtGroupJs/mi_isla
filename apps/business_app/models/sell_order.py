from django.db import models
from django.core import validators

from apps.business_app.models.shipping_type import ShippingType
from apps.common.models import BaseModel


class SellOrder(BaseModel):
    shipping_type = models.ForeignKey(
        to=ShippingType,
        verbose_name="Tipo de envío",
        on_delete=models.DO_NOTHING,
    )

    weight = models.FloatField(
        verbose_name="Peso",
        validators=[validators.MinValueValidator(limit_value=0)],
    )

    subtotal_without_shipping = models.FloatField(
        verbose_name="Precio sin envío",
        validators=[validators.MinValueValidator(limit_value=0)],
    )
    total_with_shipping = models.FloatField(
        verbose_name="Precio total con envío",
        validators=[validators.MinValueValidator(limit_value=0)],
    )
    generated_whatsapp_message = models.TextField(
        verbose_name="Mensaje de whatsapp generado"
    )

    class Meta:
        verbose_name = "Orden de compra"
        verbose_name_plural = "Órdenes de compra"

    def __str__(self):
        return f"{self.total_with_shipping} ({self.shipping_type})"
