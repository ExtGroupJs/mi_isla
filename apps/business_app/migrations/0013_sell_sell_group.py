# Generated by Django 5.1.1 on 2024-11-19 17:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("business_app", "0012_sellgroup"),
    ]

    operations = [
        migrations.AddField(
            model_name="sell",
            name="sell_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sells",
                to="business_app.sellgroup",
                verbose_name="Grupo de Ventas",
            ),
        ),
    ]
