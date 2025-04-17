from rest_framework import serializers

from apps.business_app.models.product import Product
from apps.business_app.serializers.category import (
    CategorySerializer,
)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "category",
            "description",
            "image",
            "quantity",
            "sell_price",
            "weight",
        )


class CatalogProductSerializer(ProductSerializer):
    category = CategorySerializer()

    class Meta(ProductSerializer.Meta):
        model = Product
        fields = (
            "id",
            "name",
            "category",
            "description",
            "image",
            "quantity",
            "sell_price",
            "weight",
            "__str__",
        )
