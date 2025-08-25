# accounts/views.py
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Account
from .serializers import AccountSerializer
from django.contrib.auth.hashers import make_password



# Get all accounts
@api_view(['GET'])
def account_list(request):
    if request.method == 'GET':
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def account_create(request):
    data = request.data.copy()

    if "password" in data:
        data['password'] = make_password(data['password'])
        request.data['password'] = data['password']
    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get one account by ID
@api_view(['GET'])
def account_detail(request, pk):
    try:
        account = Account.objects.get(pk=pk)
    except Account.DoesNotExist:
        return JsonResponse({'error': 'Account not found'}, status=404)

    serializer = AccountSerializer(account)
    return JsonResponse(serializer.data)

