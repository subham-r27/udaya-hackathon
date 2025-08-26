from rest_framework import serializers
from .models import Participant, Team

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    leader = ParticipantSerializer()
    participant_2 = ParticipantSerializer()
    participant_3 = ParticipantSerializer()
    participant_4 = ParticipantSerializer(required=False, allow_null=True)

    class Meta:
        model = Team
        fields = ['id', 'team_name', 'leader', 'participant_2', 'participant_3', 'participant_4', 'topic', 'idea_submission_pdf']

    def create(self, validated_data):
        leader_data = validated_data.pop('leader')
        participant_2_data = validated_data.pop('participant_2')
        participant_3_data = validated_data.pop('participant_3')
        participant_4_data = validated_data.pop('participant_4', None)

        leader = Participant.objects.create(**leader_data)
        p2 = Participant.objects.create(**participant_2_data)
        p3 = Participant.objects.create(**participant_3_data)
        
        team = Team.objects.create(leader=leader, participant_2=p2, participant_3=p3, **validated_data)

        if participant_4_data:
            p4 = Participant.objects.create(**participant_4_data)
            team.participant_4 = p4
            
        team.save()
        return team