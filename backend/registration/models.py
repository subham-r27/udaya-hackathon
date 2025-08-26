from django.db import models

class Participant(models.Model):
    YEAR_CHOICES = [
        ('2026', '2026'),
        ('2027', '2027'),
        ('2028', '2028'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    year_of_passing = models.CharField(max_length=4, choices=YEAR_CHOICES)
    college_name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Team(models.Model):
    TOPIC_CHOICES = [
        ('Speculative / Future Design', 'Speculative / Future Design'),
        ('Immersive Interaction Design (AR/VR/XR)', 'Immersive Interaction Design (AR/VR/XR)'),
        ('AI in Education', 'AI in Education'),
        ('AI in Agriculture', 'AI in Agriculture'),
        ('AI in Healthcare', 'AI in Healthcare'),
    ]

    team_name = models.CharField(max_length=100, unique=True)
    leader = models.OneToOneField(Participant, on_delete=models.CASCADE, related_name='led_team')
    # Participant 2 is now required
    participant_2 = models.OneToOneField(Participant, on_delete=models.CASCADE, related_name='team_participant_2')
    # Participant 3 is now required
    participant_3 = models.OneToOneField(Participant, on_delete=models.CASCADE, related_name='team_participant_3')
    # Participant 4 remains optional
    participant_4 = models.OneToOneField(Participant, on_delete=models.CASCADE, related_name='team_participant_4', null=True, blank=True)
    topic = models.CharField(max_length=100, choices=TOPIC_CHOICES)
    idea_submission_pdf = models.FileField(upload_to='idea_submissions/')
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.team_name
