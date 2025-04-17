from unicodedata import category
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
            "description",
            "model",
            "image",
        )
class CatalogProductSerializer(ProductSerializer):
    category = CategorySerializer()

    class Meta(ProductSerializer.Meta):
        model = Product
        fields = ("name", "category_name", "image", "__str__")
