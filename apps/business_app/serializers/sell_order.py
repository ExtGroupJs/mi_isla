from rest_framework import serializers

from apps.business_app.models.sell_order import SellOrder


class SellOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellOrder
        fields = (
            "id",
            "shipping_type",
            "weight",
            "subtotal_without_shipping",
            "total_with_shipping",
            "generated_whatsapp_message",
            "updated_timestamp",
        )
