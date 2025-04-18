# Generated by Django 5.1.1 on 2025-04-17 13:15

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=250, unique=True, verbose_name="Nombre"
                    ),
                ),
                (
                    "extra_info",
                    models.TextField(
                        blank=True, null=True, verbose_name="Información Extra"
                    ),
                ),
                (
                    "price_by_weight",
                    models.FloatField(
                        validators=[
                            django.core.validators.MinValueValidator(limit_value=0)
                        ],
                        verbose_name="Precio por libra",
                    ),
                ),
            ],
            options={
                "verbose_name": "Categoría",
                "verbose_name_plural": "Categorías",
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_timestamp",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Created timestamp"
                    ),
                ),
                (
                    "updated_timestamp",
                    models.DateTimeField(
                        auto_now=True, null=True, verbose_name="Updated timestamp"
                    ),
                ),
                ("name", models.CharField(max_length=200, verbose_name="Nombre")),
                (
                    "description",
                    models.TextField(blank=True, null=True, verbose_name="Descripción"),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="", verbose_name="Imagen"
                    ),
                ),
                (
                    "quantity",
                    models.PositiveIntegerField(default=0, verbose_name="Cantidad"),
                ),
                (
                    "sell_price",
                    models.FloatField(
                        validators=[
                            django.core.validators.MinValueValidator(limit_value=0)
                        ],
                        verbose_name="Precio",
                    ),
                ),
                (
                    "weight",
                    models.FloatField(
                        validators=[
                            django.core.validators.MinValueValidator(limit_value=0)
                        ],
                        verbose_name="Peso",
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="business_app.category",
                        verbose_name="Categoría",
                    ),
                ),
            ],
            options={
                "verbose_name": "Producto",
                "verbose_name_plural": "Productos",
            },
        ),
        migrations.CreateModel(
            name="ProductGallery",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("picture", models.ImageField(upload_to="", verbose_name="Imagen")),
                (
                    "extra_info",
                    models.TextField(blank=True, null=True, verbose_name="Extra Info"),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_gallery_pictures",
                        to="business_app.product",
                        verbose_name="Product",
                    ),
                ),
            ],
            options={
                "verbose_name": "Galería de Producto",
                "verbose_name_plural": "Galería de productos",
            },
        ),
    ]
