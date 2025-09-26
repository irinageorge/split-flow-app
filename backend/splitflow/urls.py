from django.urls import path
from . import views

urlpatterns = [
    path("bills/", views.bill_list_create, name="bill-list-create"),
    path("bills/<int:pk>/", views.bill_detail, name="bill-detail"),
    path("bills/<int:bill_id>/entries/", views.bill_entry_create, name="bill-entry-create"),
]