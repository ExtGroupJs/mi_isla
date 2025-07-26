from rest_framework import serializers

from apps.business_app.models.category import Category
from apps.business_app.models.sub_category_model import SubCategory


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = (
            "id",
            "name",
            "extra_info",
            "price_by_weight",
            "category",
        )
