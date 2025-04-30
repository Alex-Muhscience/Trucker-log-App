from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from io import BytesIO
from .models import Trip, DailyLog
from .services import HOSService
from .serializers import TripSerializer
import os

class PlanTripView(APIView):
    def post(self, request):
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            trip_data = serializer.validated_data
            map_api_key = os.getenv('MAP_API_KEY')
            
            # Plan trip with HOS compliance
            trip_plan = HOSService.plan_trip(trip_data, map_api_key)
            
            # Generate daily logs
            daily_logs = HOSService.generate_daily_logs(trip_plan['hos_plan'], trip_data)
            
            # Save trip and logs to database
            trip = Trip.objects.create(**trip_data)
            for log in daily_logs:
                DailyLog.objects.create(
                    trip=trip,
                    date=log['date'],
                    total_miles=log['total_miles'],
                    graph_grid=log['graph_grid'],
                    remarks=log['remarks']
                )
            
            return Response({
                'trip_plan': trip_plan,
                'daily_logs': daily_logs
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DownloadLogView(APIView):
    def get(self, request, log_id):
        try:
            log = DailyLog.objects.get(id=log_id)
            trip = log.trip
            
            # Generate PDF
            pdf = HOSService.generate_pdf({
                'date': log.date,
                'graph_grid': log.graph_grid,
                'remarks': log.remarks,
                'total_miles': log.total_miles
            }, {
                'driver_name': trip.driver_name,
                'carrier_name': trip.carrier_name,
                'truck_number': trip.truck_number
            })
            
            # Create response
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="daily_log_{log.date}.pdf"'
            return response
        except DailyLog.DoesNotExist:
            return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)