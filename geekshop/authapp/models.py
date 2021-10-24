from django.db import models
from django.contrib.auth.models import AbstractUser


class ShopUser(AbstractUser):
    avatar = models.ImageField(upload_to='users_avatars', blank=True, verbose_name='Аватар')
    age = models.PositiveSmallIntegerField(verbose_name='Возраст')
