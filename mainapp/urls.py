from django.urls import path
from mainapp import views as mainapp
from django.views.decorators.cache import cache_page

app_name = 'mainapp'

urlpatterns = [
    path('', cache_page(3600)(mainapp.products), name='products'),
    path('category/<int:pk>/', mainapp.products, name='category'),
    path('category/<int:pk>/<int:page>/', mainapp.products, name='category_page'),
    path('product/<int:pk>/', mainapp.product, name='product'),

]
