from django.urls import path
from . import views

urlpatterns = [
    path("create-bill", views.bill_list_create, name="bill-list-create"),
    path("<int:bill_id>/bill-details", views.bill_detail, name="bill-detail"),
    path("<int:bill_id>/bills/entries", views.bill_entry_create, name="bill-entry-create"),
    path("<int:bill_id>/bill-edit", views.bill_edit, name="bill-edit"),
    path("<int:account_id>/bills-by-user", views.bills_by_user, name="bills-by-user"),
    path("<int:account_id>/bill-leave", views.leave_bills, name="bill-leave"),
]