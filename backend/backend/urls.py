# backend/urls.py
from django.contrib import admin
from django.urls import path
from accounts.views import account_list, account_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', account_list),             # /api/accounts/ returns all
    path('accounts/<int:pk>/', account_detail), # /api/accounts/1/ returns single
]
