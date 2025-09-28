from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status

from .decorators import check_entry_owner
from .models import Bill, BillEntry, BillUser
from .serializers import BillSerializer, BillEntrySerializer, UserJoinedBillSerializer
from accounts.models import Account


@api_view(["POST"])
def bill_list_create(request):
    account_id = request.data.get("account_id")
    try:
        account = Account.objects.get(id=account_id)
    except Account.DoesNotExist:
        return JsonResponse({"error": "Account not found"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = BillSerializer(data=request.data)
    if serializer.is_valid():
        bill = serializer.save(created_by=account)
        BillUser.objects.create(bill=bill, user=account)
        return JsonResponse(BillSerializer(bill).data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def bills_by_user(request, account_id):
    try:
        user = Account.objects.get(id=account_id)
    except Account.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    bills = Bill.objects.filter(billuser__user=user)

    serializer = UserJoinedBillSerializer(bills, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def bill_detail(request, bill_id):
    try:
        bill = Bill.objects.get(pk=bill_id)
    except Bill.DoesNotExist:
        return JsonResponse({"error": "Bill not found"}, status=404)

    serializer = BillSerializer(bill)
    return JsonResponse(serializer.data)


@api_view(["POST"])
def bill_entry_create(request, bill_id):
    try:
        bill = Bill.objects.get(pk=bill_id)
    except Bill.DoesNotExist:
        return JsonResponse({"error": "Bill not found"}, status=404)

    account_id = request.data.get("account_id")
    try:
        account = Account.objects.get(id=account_id)
    except Account.DoesNotExist:
        return JsonResponse({"error": "Account not found"}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data.copy()
    data["bill"] = bill.id

    serializer = BillEntrySerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=account, bill=bill)
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT", "PATCH"])
@check_entry_owner
def bill_entry_edit(request, entry_id):
    try:
        entry = BillEntry.objects.get(pk=entry_id)
    except BillEntry.DoesNotExist:
        return JsonResponse({"error": "Entry not found"}, status=404)

    serializer = BillEntrySerializer(entry, data=request.data, partial=(request.method=="PATCH"))
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=400)

@api_view(["DELETE"])
@check_entry_owner
def bill_entry_delete(request, entry_id):
    try:
        entry = BillEntry.objects.get(pk=entry_id)
    except BillEntry.DoesNotExist:
        return JsonResponse({"error": "Entry not found"}, status=404)

    entry.delete()
    return JsonResponse({"message": "Bill entry deleted successfully"}, status=204)

@api_view(["PUT", "PATCH"])
def bill_edit(request, bill_id):
    try:
        bill = Bill.objects.get(pk=bill_id)
    except Bill.DoesNotExist:
        return JsonResponse({"error": "Bill not found"}, status=404)

    serializer = BillSerializer(bill, data=request.data, partial=(request.method=="PATCH"))
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=400)

@api_view(["POST"])
def leave_bills(request, account_id):
    user = Account.objects.get(id=account_id)
    bill_ids = request.data.get("bill_ids", [])

    if not bill_ids:
        return JsonResponse({"detail": "No bills selected"}, status=400)

    deleted_count, _ = BillUser.objects.filter(user=user, bill_id__in=bill_ids).delete()

    return JsonResponse({"detail": f"Removed from {deleted_count} bills"})