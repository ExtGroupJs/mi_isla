from click import Group
from django.core.management import call_command
from django.core.management.base import BaseCommand
from termcolor import colored

from apps.users_app.models.groups import Groups
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Loads initial fixtures"

    def handle(self, *args, **options):
        # print(
        #     colored(
        #         "There's no fixtures to add yet",
        #         "red",
        #         attrs=["blink"],
        #     )
        # )

        call_command("loaddata", "auth.group.json")
        print(
            colored(
                "Successfully added group permissions",
                "green",
                attrs=["blink"],
            )
        )

        admin_user = User.objects.get(username="admin")
        admin_user.groups.add(Groups.SUPER_ADMIN, Groups.SHOP_OWNER)
        print(
            colored(
                "Promoted default admin user as SUPER_ADMIN and SHOP_OWNER",
                "blue",
                attrs=["blink"],
            )
        )
        call_command("loaddata", "shipping_type.json")
        print(
            colored(
                "Successfully added Shipping Types",
                "green",
                attrs=["blink"],
            )
        )
        call_command("loaddata", "category.json")
        print(
            colored(
                "Successfully added Categories",
                "green",
                attrs=["blink"],
            )
        )
        call_command("loaddata", "product.json")
        print(
            colored(
                "Successfully added Products",
                "green",
                attrs=["blink"],
            )
        )
