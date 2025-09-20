from django.db import models

# Create your models here.
from django.db import models

class Account(models.Model):
    username = models.CharField(
        max_length=20,
        unique=True,
    )
    password = models.CharField()

    email = models.CharField(
        unique=True,
        max_length=50
    )

    def __str__(self):
        return self.username