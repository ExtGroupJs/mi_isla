from jsonschema import ValidationError
from rest_framework import serializers

from apps.business_app.models.product import Product
from apps.business_app.serializers.category import (
    CategorySerializer,
)


class ProductSerializer(serializers.ModelSerializer):
    category_info = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "category",
            "sub_category",
            "category_info",
            "description",
            "image",
            "quantity",
            "sell_price",
            "weight",
        )
        extra_kwargs = {
            "category": {"write_only": True},
        }

    def validate(self, attr):
        category = attr.get("category")
        sub_category = attr.get("sub_category")
        if sub_category.super_category is not category:
            raise ValidationError(
                "La subcategoría no pertenece a la categoría escogida"
            )
        return attr


# class CatalogProductSerializer(ProductSerializer):
#     category = CategorySerializer()

#     class Meta(ProductSerializer.Meta):
#         model = Product
#         fields = (
#             "id",
#             "name",
#             "category",
#             "description",
#             "image",
#             "quantity",
#             "sell_price",
#             "weight",
#             "__str__",
#         )
