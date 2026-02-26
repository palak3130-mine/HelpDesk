from rest_framework import serializers
from tickets.models import TicketActivity


class TicketActivitySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = TicketActivity
        fields = [
            "id",
            "old_status",
            "new_status",
            "changed_by",
            "created_at",
        ]