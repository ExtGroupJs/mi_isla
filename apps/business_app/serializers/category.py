from rest_framework import serializers

from apps.business_app.models.category import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "extra_info",
            "price_by_weight",
            "in_cuba",
            "priced_per_unit",
        )
