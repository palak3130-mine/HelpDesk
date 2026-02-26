from rest_framework import serializers
from tickets.models import Ticket
from core.models import SubIssue
from tickets.models import Staff


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = [
            "ticket_number",
            "created_at",
            "updated_at",
            "assigned_at",
            "started_at",
            "resolved_at",
            "closed_at",
        ]


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["issue", "sub_issue", "description"]

    def validate(self, data):
        if data["sub_issue"].issue != data["issue"]:
            raise serializers.ValidationError(
                "Selected sub-issue does not belong to selected issue."
            )
        return data


class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["status", "assigned_to"]

    def validate(self, data):
        ticket = self.instance
        user = self.context["request"].user

        transitions = {
            Ticket.Status.CREATED: [Ticket.Status.ASSIGNED],
            Ticket.Status.ASSIGNED: [Ticket.Status.STARTED],
            Ticket.Status.STARTED: [Ticket.Status.RESOLVED],
            Ticket.Status.RESOLVED: [Ticket.Status.CLOSED],
            Ticket.Status.CLOSED: [],
        }

        allowed = transitions.get(ticket.status, [])

        if user.role == "STAFF":
            allowed = [s for s in allowed if s != Ticket.Status.CLOSED]

        if user.role == "CLIENT":
            raise serializers.ValidationError("Clients cannot update ticket status.")

        if data["status"] not in allowed:
            raise serializers.ValidationError(
                f"Transition from {ticket.status} to {data['status']} not allowed."
            )

        if "assigned_to" in data:
            if data["assigned_to"].specialty != ticket.issue:
                raise serializers.ValidationError(
                    "Assigned staff does not match ticket issue."
                )

        return data