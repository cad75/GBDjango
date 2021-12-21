from django.test import TestCase
from django.test.client import Client

from authapp.models import ShopUser
from mainapp.models import ProductCategory, Product


class AuthUserTestCase(TestCase):
    status_ok = 200
    status_redirect = 302
    username = 'django'
    password = 'geekbrains'

    def setUp(self) -> None:
        self.client = Client()
        self.category = ProductCategory.objects.create(
            name='cat1'
        )
        for i in range(10):
            Product.objects.create(
                name=f'prod-{i}',
                category=self.category,
                short_desc='shortdesc',
                description='desc'
            )

        self.superuser = ShopUser.objects.create_superuser(
            username=self.username,
            password=self.password,
        )

    def test_login(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, self.status_ok)

        self.assertTrue(response.context['user'].is_anonymous)
        self.assertNotContains(response, 'Пользователь', status_code=self.status_ok)

        self.client.login(username=self.username, password=self.password)

        response = self.client.get('/auth/login/')
        self.assertFalse(response.context['user'].is_anonymous)
        self.assertEqual(response.status_code, self.status_ok)
        response = self.client.get('/')
        self.assertContains(response, 'Пользователь', status_code=self.status_ok)

    def get_redirect(self):
        product = Product.objects.first()
        response = self.client.get(f'/basket/add/{product.pk}/')
        self.assertEqual(response.status_code, self.status_redirect)


    # def test_register(self):


