from rest_framework import generics
from .models import Team
from .serializers import TeamSerializer
from django.core.mail import send_mail
from django.conf import settings

class TeamRegistrationView(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def perform_create(self, serializer):
        team = serializer.save()
        
        # Optional: Send email notifications
        participants = [team.leader, team.participant_2, team.participant_3]
        if team.participant_4: participants.append(team.participant_4)

        subject = f'Udaya Hackathon Registration Successful for Team {team.team_name}'
        message = f'Hello {team.leader.name},\n\nYour team "{team.team_name}" has been successfully registered for the Udaya Hackathon.\n\nWe are excited to have you on board!\n\nBest regards,\nThe Udaya Team'
        
        recipient_list = [p.email for p in participants]

        # Uncomment the following lines to enable email sending
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
        except Exception as e:
            print(f"Error sending email: {e}") # Log error