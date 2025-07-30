from django.db import models
from django.core import validators

from apps.business_app.models.category import Category
from apps.business_app.models.sub_category_model import SubCategory
from apps.common.models import BaseModel
from PIL import Image, ImageOps


class Product(BaseModel):
    name = models.CharField(verbose_name="Nombre", max_length=200)
    category = models.ForeignKey(
        to=Category,
        verbose_name="Categoría",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="productos",
    )
    sub_category = models.ForeignKey(
        to=SubCategory,
        verbose_name="Subcategoría",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="productos",
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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)
            # Convertir a RGB si tiene transparencia (RGBA → RGB con fondo blanco)

            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGBA")
                background = Image.new(
                    "RGBA", img.size, (255, 255, 255, 255)
                )  # Fondo blanco
                img = Image.alpha_composite(background, img).convert("RGB")

            # Obtener dimensiones originales
            width, height = img.size

            # Determinar el tamaño objetivo (cuadrado 768x768)
            target_size = (768, 768)

            # Calcular la relación de aspecto y redimensionar manteniendo proporciones
            if width > height:
                # Imagen horizontal (ancho > alto)
                new_width = target_size[0]
                new_height = int(height * (new_width / width))
            else:
                # Imagen vertical (alto > ancho) o cuadrada
                new_height = target_size[1]
                new_width = int(width * (new_height / height))

            # Redimensionar manteniendo la proporción
            resized_img = img.resize((new_width, new_height), reducing_gap=3.0)

            # Crear una nueva imagen cuadrada con fondo blanco (o el color que prefieras)
            squared_img = Image.new("RGB", target_size, (255, 255, 255))  # Fondo blanco

            # Pegar la imagen redimensionada centrada
            offset = (
                (target_size[0] - new_width) // 2,  # Margen izquierdo
                (target_size[1] - new_height) // 2,  # Margen superior
            )
            squared_img.paste(resized_img, offset)

            # Guardar la imagen final
            squared_img.save(self.image.path)
