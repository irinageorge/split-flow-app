from django.urls import path
from . import views

urlpatterns = [
    path('', views.account_list, name='account-list'),
    path('<int:pk>/', views.account_detail, name='account-detail'),
    path('create/', views.account_create, name='account-create'),
]