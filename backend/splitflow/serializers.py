from rest_framework import serializers
from .models import BillEntry, Bill


class BillEntrySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BillEntry
        fields = ["id", "user", "amount", "notes", "added_on"]


class BillSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    entries = BillEntrySerializer(many=True, read_only=True)
    created_on = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = ["id", "title", "created_by", "created_on", "is_closed", "entries", "location", 'spend']

    def get_created_on(self, obj):
        return obj.created_on.date()

class UserJoinedBillSerializer(serializers.ModelSerializer):
    created_on = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = ["id", "title", "created_on", "is_closed", "location", "spend", "created_by"]

    def get_created_on(self, obj):
        return obj.created_on.date()

    def get_created_by(self, obj):
        return obj.created_by.username