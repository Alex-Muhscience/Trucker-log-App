from django.db import models

class Trip(models.Model):
    driver_name = models.CharField(max_length=100)
    carrier_name = models.CharField(max_length=100)
    office_address = models.TextField()
    truck_number = models.CharField(max_length=50)
    current_location = models.CharField(max_length=100)
    pickup_location = models.CharField(max_length=100)
    dropoff_location = models.CharField(max_length=100)
    current_cycle_used = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Trip by {self.driver_name} from {self.pickup_location} to {self.dropoff_location}"

class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    total_miles = models.FloatField()
    graph_grid = models.TextField()  # JSON representation of the grid
    remarks = models.TextField()
    
    def __str__(self):
        return f"Daily Log for {self.date} - Trip {self.trip.id}"