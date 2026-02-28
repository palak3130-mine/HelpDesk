from rest_framework import serializers
from tickets.models import Ticket
from accounts.models import User


class TicketSerializer(serializers.ModelSerializer):

    # Client info
    client_name = serializers.CharField(source="client.user.username", read_only=True)
    client_email = serializers.CharField(source="client.user.email", read_only=True)
    company_name = serializers.CharField(source="client.company_name", read_only=True)
    client_phone = serializers.CharField(source="client.whatsapp_number", read_only=True)

    # Issue info
    issue_name = serializers.CharField(source="issue.name", read_only=True)
    sub_issue_name = serializers.CharField(source="sub_issue.name", read_only=True)

    # Staff info
    assigned_staff = serializers.CharField(
        source="assigned_to.user.username",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_number",
            "status",
            "description",
            "created_at",
            "updated_at",
            "client",
            "issue",
            "sub_issue",
            "assigned_to",
            "client_name",
            "client_email",
            "company_name",
            "client_phone",
            "issue_name",
            "sub_issue_name",
            "assigned_staff",
        ]
        read_only_fields = ["ticket_number", "created_at", "updated_at"]


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

        # Only validate active status updates
        if "status" in data:
            transitions = {
                Ticket.Status.CREATED: [Ticket.Status.ASSIGNED],
                Ticket.Status.ASSIGNED: [Ticket.Status.STARTED],
                Ticket.Status.STARTED: [Ticket.Status.RESOLVED],
                Ticket.Status.RESOLVED: [Ticket.Status.CLOSED],
                Ticket.Status.CLOSED: [],
            }

            allowed = transitions.get(ticket.status, [])

            if user.role == User.Role.STAFF:
                allowed = [s for s in allowed if s != Ticket.Status.CLOSED]

            if user.role == User.Role.CLIENT:
                raise serializers.ValidationError("Clients cannot update ticket status.")

            if data["status"] not in allowed:
                raise serializers.ValidationError(
                    f"Transition from {ticket.status} to {data['status']} not allowed."
                )

        # Validate assigned_to field
        if "assigned_to" in data and data["assigned_to"]:
            if data["assigned_to"].specialty != ticket.issue:
                raise serializers.ValidationError(
                    "Assigned staff does not match ticket issue."
                )

        return data