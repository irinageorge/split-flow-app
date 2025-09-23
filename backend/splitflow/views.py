from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Bill, BillEntry, BillUser
from .serializers import BillSerializer, BillEntrySerializer
from accounts.models import Account


@api_view(["GET", "POST"])
def bill_list_create(request):
    if request.method == "GET":
        bills = Bill.objects.all()
        serializer = BillSerializer(bills, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
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
def bill_detail(request, pk):
    try:
        bill = Bill.objects.get(pk=pk)
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