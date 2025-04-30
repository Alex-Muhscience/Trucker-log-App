from rest_framework import serializers
from .models import Trip, DailyLog


class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = ['id', 'date', 'total_miles', 'remarks']


class TripSerializer(serializers.ModelSerializer):
    daily_logs = DailyLogSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id', 'driver_name', 'carrier_name', 'office_address',
            'truck_number', 'current_location', 'pickup_location',
            'dropoff_location', 'current_cycle_used', 'daily_logs'
        ]