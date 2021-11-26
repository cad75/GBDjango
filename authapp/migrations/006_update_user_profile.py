from django.db import migrations, models

from authapp.models import ShopUser, ShopUserProfile


def update_user_profile(apps, schema_editor):
    users = ShopUser.objects.all()
    for user in users:
        if not user.shopuserprofile:
            ShopUserProfile.objects.create(user=user)


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0005_shopuser_avatar_url'),
    ]

    operations = [
        migrations.RunPython(update_user_profile)
    ]
