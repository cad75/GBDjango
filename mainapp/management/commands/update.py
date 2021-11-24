from django.core.management.base import BaseCommand

from authapp.models import ShopUser, ShopUserProfile


class Command(BaseCommand):

    def handle(self, *args, **options):
        users = ShopUser.objects.all()
        for user in users:
            ShopUserProfile.objects.create(user=user)

