from rest_framework import serializers

from apps.business_app.models.shipping_type import ShippingType


class ShippingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingType
        fields = (
            "id",
            "name",
            "description",
            "image",
            "min_weight_allowed",
            "price_by_weight_unit",
            "time_to_delivery",
        )
