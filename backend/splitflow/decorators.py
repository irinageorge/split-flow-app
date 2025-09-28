from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Account, BillEntry

def check_entry_owner(view_func):
    @wraps(view_func)
    def _wrapped_view(request, entry_id, *args, **kwargs):
        account_id = request.data.get("account_id") or request.query_params.get("account_id")
        if not account_id:
            return Response({"detail": "Account ID required."}, status=status.HTTP_400_BAD_REQUEST)

        entry = get_object_or_404(BillEntry, pk=entry_id)
        if entry.user.id != int(account_id):
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        request.entry = entry
        return view_func(request, entry_id, *args, **kwargs)
    return _wrapped_view