from django.contrib import admin

from apps.business_app.models.category import Category
from apps.business_app.models.product import Product
from apps.business_app.models.product_gallery import ProductGallery
from apps.business_app.models.sell_order import SellOrder
from apps.business_app.models.shipping_type import ShippingType
# from apps.business_app.models.sell import Sell
# from apps.business_app.models.sell_group import SellGroup
# from apps.business_app.models.shop_products import ShopProducts


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    empty_value_display = "-empty-"
    list_display = (
        "id",
        "name",
        "category",
        "description",
        "image",
        "quantity",
        "sell_price",
        "weight",
    )
    fields = [
        "name",
        "category",
        "description",
        "image",
        "quantity",
        "sell_price",
        "weight",
    ]


@admin.register(ShippingType)
class ShippingTypeAdmin(admin.ModelAdmin):
    empty_value_display = "-empty-"
    list_display = (
        "id",
        "name",
        "description",
        "image",
        "min_weight_allowed",
        "price_by_weight_unit",
        "time_to_delivery",
    )
    fields = [
        "name",
        "description",
        "image",
        "min_weight_allowed",
        "price_by_weight_unit",
        "time_to_delivery",
    ]


@admin.register(ProductGallery)
class ProductGalleryAdmin(admin.ModelAdmin):
    empty_value_display = "-empty-"
    list_display = (
        "id",
        "product",
        "picture",
        "extra_info",
    )
    fields = [
        "product",
        "picture",
        "extra_info",
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    empty_value_display = "-empty-"
    list_display = (
        "id",
        "name",
        "extra_info",
        "price_by_weight",
        "in_cuba",
        "priced_per_unit",
    )
    fields = [
        "name",
        "extra_info",
        "price_by_weight",
        "in_cuba",
        "priced_per_unit",
    ]


@admin.register(SellOrder)
class SellOrderAdmin(admin.ModelAdmin):
    empty_value_display = "-empty-"
    list_display = [
        "id",
        "shipping_type",
        "weight",
        "subtotal_without_shipping",
        "total_with_shipping",
        "generated_whatsapp_message",
        "updated_timestamp",
    ]
    fields = [
        "shipping_type",
        "weight",
        "subtotal_without_shipping",
        "total_with_shipping",
        "generated_whatsapp_message",
    ]


# @admin.register(SellGroup)
# class SellGroupAdmin(admin.ModelAdmin):
#     empty_value_display = "-empty-"
#     list_display = [
#         "id",
#         "discount",
#         "seller",
#         "extra_info",
#         "payment_method",
#         "client",
#     ]
#     fields = [
#         "discount",
#         "seller",
#         "extra_info",
#         "payment_method",
#         "client",
#     ]
