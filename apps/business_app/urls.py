# from rest_framework import routers
from rest_framework_extensions.routers import ExtendedSimpleRouter

from apps.business_app.views.category import CategoryViewSet
from apps.business_app.views.product import ProductViewSet
from apps.business_app.views.shipping_type import ShippingTypeViewSet

router = ExtendedSimpleRouter()

router.register(
    "category",
    CategoryViewSet,
    basename="category",
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
urlpatterns = []

urlpatterns += router.urls
