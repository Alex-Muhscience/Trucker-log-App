import json
from datetime import datetime, timedelta
import requests
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

class HOSService:
    MAX_DRIVING_WINDOW = 14 * 60  # minutes
    MAX_DRIVING_TIME = 11 * 60    # minutes
    MIN_BREAK_TIME = 30           # minutes
    MAX_CYCLE_HOURS = 70 * 60     # minutes
    MIN_OFF_DUTY = 10 * 60        # minutes
    
    @staticmethod
    def calculate_route(start, end, api_key):
        """Calculate route using OpenRouteService API"""
        base_url = "https://api.openrouteservice.org/v2/directions/driving-car"
        headers = {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': api_key
        }
        params = {
            'start': f"{start['lng']},{start['lat']}",
            'end': f"{end['lng']},{end['lat']}"
        }
        
        response = requests.get(base_url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            distance = data['features'][0]['properties']['segments'][0]['distance'] / 1609.34  # convert to miles
            duration = data['features'][0]['properties']['segments'][0]['duration'] / 60  # convert to minutes
            return distance, duration, data['features'][0]['geometry']['coordinates']
        return None, None, None

    @staticmethod
    def plan_trip(trip_data, map_api_key):
        """Plan trip with HOS compliance"""
        # Convert locations to coordinates (simplified - in production you'd use geocoding)
        locations = {
            'current': {'lat': 0, 'lng': 0},  # would be geocoded
            'pickup': {'lat': 0, 'lng': 0},   # would be geocoded
            'dropoff': {'lat': 0, 'lng': 0}   # would be geocoded
        }
        
        # Calculate route segments
        segments = []
        total_distance = 0
        total_duration = 0
        
        # Current to Pickup
        distance, duration, coords = HOSService.calculate_route(
            locations['current'], locations['pickup'], map_api_key)
        if distance and duration:
            segments.append({
                'type': 'drive',
                'distance': distance,
                'duration': duration,
                'coordinates': coords
            })
            total_distance += distance
            total_duration += duration
        
        # Add pickup time (1 hour)
        segments.append({
            'type': 'on_duty_not_driving',
            'activity': 'Pickup',
            'duration': 60,
            'location': trip_data['pickup_location']
        })
        total_duration += 60
        
        # Pickup to Dropoff
        distance, duration, coords = HOSService.calculate_route(
            locations['pickup'], locations['dropoff'], map_api_key)
        if distance and duration:
            segments.append({
                'type': 'drive',
                'distance': distance,
                'duration': duration,
                'coordinates': coords
            })
            total_distance += distance
            total_duration += duration
        
        # Add dropoff time (1 hour)
        segments.append({
            'type': 'on_duty_not_driving',
            'activity': 'Dropoff',
            'duration': 60,
            'location': trip_data['dropoff_location']
        })
        total_duration += 60
        
        # Apply HOS rules to segments
        hos_plan = HOSService.apply_hos_rules(segments, trip_data['current_cycle_used'])
        
        return {
            'total_distance': total_distance,
            'total_duration': total_duration,
            'hos_plan': hos_plan,
            'route_coordinates': [seg['coordinates'] for seg in segments if 'coordinates' in seg]
        }

    @staticmethod
    def apply_hos_rules(segments, current_cycle_used):
        """Apply HOS rules to trip segments"""
        # Convert current cycle used to minutes
        cycle_remaining = (70 * 60) - (current_cycle_used * 60)
        
        hos_plan = []
        driving_time = 0
        window_time = 0
        last_break = 0
        current_status = 'off_duty'
        
        for segment in segments:
            if segment['type'] == 'drive':
                # Check if we need a break
                if driving_time >= 8 * 60 and last_break < 30:
                    # Add 30-minute break
                    hos_plan.append({
                        'type': 'break',
                        'duration': 30,
                        'reason': 'Mandatory 30-minute break after 8 hours driving'
                    })
                    driving_time = 0
                    last_break = 30
                    window_time += 30
                    cycle_remaining -= 30
                
                # Check if we've hit driving limits
                if driving_time + segment['duration'] > 11 * 60:
                    # Split driving segment
                    remaining_drive_time = (11 * 60) - driving_time
                    hos_plan.append({
                        'type': 'drive',
                        'duration': remaining_drive_time,
                        'distance': segment['distance'] * (remaining_drive_time / segment['duration'])
                    })
                    driving_time += remaining_drive_time
                    window_time += remaining_drive_time
                    cycle_remaining -= remaining_drive_time
                    
                    # Add 10-hour off-duty period
                    hos_plan.append({
                        'type': 'off_duty',
                        'duration': 10 * 60,
                        'reason': 'Required off-duty after 11 hours driving'
                    })
                    driving_time = 0
                    window_time = 0
                else:
                    # Add full driving segment
                    hos_plan.append(segment)
                    driving_time += segment['duration']
                    window_time += segment['duration']
                    cycle_remaining -= segment['duration']
                
                last_break = 0
            else:
                # Non-driving activity
                hos_plan.append(segment)
                if segment['type'] != 'off_duty':
                    window_time += segment['duration']
                cycle_remaining -= segment['duration']
                
                if segment['type'] == 'break':
                    last_break += segment['duration']
        
        return hos_plan

    @staticmethod
    def generate_daily_logs(hos_plan, trip_data):
        """Generate daily logs from HOS plan"""
        # Group activities by day
        daily_activities = {}
        current_time = datetime.now()
        
        for activity in hos_plan:
            activity_date = current_time.date()
            if activity_date not in daily_activities:
                daily_activities[activity_date] = []
            
            daily_activities[activity_date].append({
                'time': current_time.time(),
                'activity': activity,
                'duration': activity['duration']
            })
            
            # Advance time
            current_time += timedelta(minutes=activity['duration'])
        
        # Create log for each day
        daily_logs = []
        for date, activities in daily_activities.items():
            # Create graph grid
            graph_grid = HOSService.create_graph_grid(activities)
            
            # Create remarks
            remarks = "\n".join([
                f"{act['time']} - {act['activity'].get('type', 'activity')} "
                f"at {act['activity'].get('location', 'unknown')}"
                for act in activities
            ])
            
            # Calculate total miles for the day
            total_miles = sum(
                act['activity']['distance'] 
                for act in activities 
                if act['activity']['type'] == 'drive'
            )
            
            daily_logs.append({
                'date': date,
                'graph_grid': graph_grid,
                'remarks': remarks,
                'total_miles': total_miles
            })
        
        return daily_logs

    @staticmethod
    def create_graph_grid(activities):
        """Create the graph grid for the log"""
        # Simplified - in a real app this would create a detailed 24-hour grid
        grid = {
            'off_duty': [],
            'sleeper_berth': [],
            'driving': [],
            'on_duty_not_driving': []
        }
        
        for activity in activities:
            act_type = activity['activity']['type']
            if act_type in grid:
                grid[act_type].append({
                    'start': activity['time'],
                    'duration': activity['duration']
                })
        
        return json.dumps(grid)

    @staticmethod
    def generate_pdf(log_data, trip_data):
        """Generate PDF for a daily log"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        elements = []
        
        # Header
        elements.append(Paragraph(f"Driver's Daily Log - {log_data['date']}", styles['Title']))
        elements.append(Paragraph(f"Driver: {trip_data['driver_name']}", styles['Normal']))
        elements.append(Paragraph(f"Carrier: {trip_data['carrier_name']}", styles['Normal']))
        
        # Grid Table
        grid_data = [
            ["Time", "Off Duty", "Sleeper Berth", "Driving", "On Duty Not Driving"],
            ["00:00", "", "", "", ""],
            # ... would fill in all 24 hours based on log_data['graph_grid']
        ]
        
        grid_table = Table(grid_data)
        grid_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(grid_table)
        
        # Remarks
        elements.append(Paragraph("Remarks:", styles['Heading2']))
        elements.append(Paragraph(log_data['remarks'], styles['Normal']))
        
        # Footer
        elements.append(Paragraph(f"Total Miles: {log_data['total_miles']}", styles['Normal']))
        elements.append(Paragraph(f"Truck Number: {trip_data['truck_number']}", styles['Normal']))
        
        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()
        return pdf