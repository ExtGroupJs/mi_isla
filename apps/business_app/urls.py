# from rest_framework import routers
from rest_framework_extensions.routers import ExtendedSimpleRouter

from apps.business_app.views.category import CategoryViewSet
from apps.business_app.views.product import ProductViewSet
from apps.business_app.views.sell_order import SellOrderViewSet
from apps.business_app.views.shipping_type import ShippingTypeViewSet
from apps.business_app.views.sub_category_view import SubCategoryViewSet

router = ExtendedSimpleRouter()

router.register(
    "category",
    CategoryViewSet,
    basename="category",
)
router.register(
    "sub-category",
    SubCategoryViewSet,
    basename="sub-category",
)
router.register(
    "products",
    ProductViewSet,
    basename="products",
)
router.register(
    "shipping-type",
    ShippingTypeViewSet,
    basename="shipping-type",
)
router.register(
    "sell-orders",
    SellOrderViewSet,
    basename="sell-orders",
)
urlpatterns = []

urlpatterns += router.urls
