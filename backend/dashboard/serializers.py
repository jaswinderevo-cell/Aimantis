# dashboard/serializers.py
from rest_framework import serializers

class OverviewSerializer(serializers.Serializer):
    checkins_today = serializers.IntegerField()
    checkouts_today = serializers.IntegerField()
    guests_in_structure = serializers.IntegerField()
    available_beds = serializers.IntegerField()
    occupied_rooms = serializers.IntegerField()

class UpcomingEventSerializer(serializers.Serializer):
    event = serializers.CharField()
    guest_name = serializers.CharField()
    nights = serializers.IntegerField()
    source = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    date = serializers.DateField()

class DashboardSerializer(serializers.Serializer):
    today_date = serializers.DateField()
    overview = OverviewSerializer()
    upcoming_events = UpcomingEventSerializer(many=True)
