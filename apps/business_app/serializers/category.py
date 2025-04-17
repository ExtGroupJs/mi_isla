from rest_framework import serializers

from apps.business_app.models.category import Category
from apps.business_app.serializers.brand import BrandSerializer, CatalogBrandSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "extra_info",
            "price_by_weight",
            "__str__",
        )
