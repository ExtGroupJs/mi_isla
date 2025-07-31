from jsonschema import ValidationError
from rest_framework import serializers

from apps.business_app.models.product import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(read_only=True)
    sub_category_name = serializers.CharField(read_only=True)
    in_cuba = serializers.BooleanField(read_only=True)
    priced_per_unit = serializers.BooleanField(read_only=True)
    price_by_weight = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "category",
            "sub_category",
            "category_name",
            "sub_category_name",
            "description",
            "in_cuba",
            "priced_per_unit",
            "price_by_weight",
            "image",
            "quantity",
            "sell_price",
            "weight",
        )

    def validate(self, attr):
        category = attr.get("category")
        sub_category = attr.get("sub_category")
        if sub_category.super_category_id != category.id:
            raise ValidationError(
                "La subcategoría no pertenece a la categoría escogida"
            )
        return attr
