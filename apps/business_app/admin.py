from django.contrib import admin

from apps.business_app.models.category import Category
from apps.business_app.models.product import Product
from apps.business_app.models.product_gallery import ProductGallery
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
    )
    fields = [
        "name",
        "extra_info",
        "price_by_weight",
        "in_cuba",
    ]


# @admin.register(Sell)
# class SellAdmin(admin.ModelAdmin):
#     empty_value_display = "-empty-"
#     list_display = [
#         "id",
#         "shop_product",
#         "sell_group",
#         "seller",
#         "extra_info",
#         "quantity",
#         "updated_timestamp",
#     ]
#     fields = [
#         "shop_product",
#         "seller",
#         "extra_info",
#         "sell_group",
#         "quantity",
#     ]
#     search_fields = [
#         "shop_product__product__name",
#         "shop_product__product__model__name",
#         "shop_product__product__model__brand__name",
#     ]


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
