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
        admin_user.groups.add(Groups.SUPER_ADMIN)
        print(
            colored(
                "Promoted default admin user as SUPER_ADMIN",
                "blue",
                attrs=["blink"],
            )
        )
