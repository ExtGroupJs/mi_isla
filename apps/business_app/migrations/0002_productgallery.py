# Generated by Django 5.1.1 on 2025-04-17 01:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('business_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductGallery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', models.ImageField(upload_to='', verbose_name='Imagen')),
                ('extra_info', models.TextField(blank=True, null=True, verbose_name='Extra Info')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_gallery_pictures', to='business_app.product', verbose_name='Product')),
            ],
            options={
                'verbose_name': 'Galería de Producto',
                'verbose_name_plural': 'Galería de productos',
            },
        ),
    ]
