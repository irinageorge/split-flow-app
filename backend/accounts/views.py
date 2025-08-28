# accounts/views.py
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Account
from .serializers import AccountSerializer
from django.contrib.auth.hashers import make_password, check_password

def home(request):
    return HttpResponse("Backend running")

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

@api_view(['POST'])
def account_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return JsonResponse({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        account = Account.objects.get(username=username)
    except Account.DoesNotExist:
        return JsonResponse({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(password, account.password):
        return JsonResponse({"message": "Login successful", "user_id": account.id}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)