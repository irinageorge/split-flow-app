# accounts/views.py
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Account
from .serializers import AccountSerializer


# Get all accounts
@api_view(['GET'])
def account_list(request):
    accounts = Account.objects.all()
    serializer = AccountSerializer(accounts, many=True)
    return JsonResponse(serializer.data, safe=False)


# Get one account by ID
@api_view(['GET'])
def account_detail(request, pk):
    try:
        account = Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)

    serializer = AccountSerializer(account)
    return JsonResponse(serializer.data)
