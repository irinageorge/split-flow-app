from django.db import models
from django.db.models import Sum

from accounts.models import Account


# Create your models here.

class Bill(models.Model):
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=50, default="Varna, Bulgaria")
    created_by = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='bills')
    created_on = models.DateTimeField(auto_now_add=True)
    is_closed = models.BooleanField(default=False)

    @property
    def spend(self):
        return self.entries.aggregate(total=Sum("amount"))["total"] or 0

    def __str__(self):
        return self.title

class BillEntry(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    added_on = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.amount}'

class BillUser(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    joined_on = models.DateTimeField(auto_now_add=True)

