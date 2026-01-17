from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from .models import LoginSession
import user_agents

class LoginSessionTrackingMiddleware:
    """Middleware to track user login sessions"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request
        response = self.get_response(request)
        
        # Track session if user is authenticated
        if (hasattr(request, 'user') and 
            not isinstance(request.user, AnonymousUser) and 
            request.session.session_key):
            
            self.track_session(request)
        
        return response

    def track_session(self, request):
        """Track or update login session"""
        session_key = request.session.session_key
        user = request.user
        
        # Get client info
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        user_agent = user_agents.parse(user_agent_string)
        ip_address = self.get_client_ip(request)
        
        # Get or create login session
        login_session, created = LoginSession.objects.get_or_create(
            session_key=session_key,
            defaults={
                'user': user,
                'ip_address': ip_address,
                'user_agent': user_agent_string,
                'device_type': self.get_device_type(user_agent),
                'browser': f"{user_agent.browser.family} {user_agent.browser.version_string}",
                'operating_system': f"{user_agent.os.family} {user_agent.os.version_string}",
                'location': self.get_location(ip_address),  # Implement geolocation if needed
            }
        )
        
        if not created:
            # Update last activity
            login_session.last_activity = timezone.now()
            login_session.save(update_fields=['last_activity'])

    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_device_type(self, user_agent):
        """Determine device type"""
        if user_agent.is_mobile:
            return 'Mobile'
        elif user_agent.is_tablet:
            return 'Tablet'
        elif user_agent.is_pc:
            return 'Desktop'
        else:
            return 'Unknown'

    def get_location(self, ip_address):
        """Get approximate location (implement geolocation service if needed)"""
        # You can integrate with services like MaxMind GeoLite2, ipstack, etc.
        # For now, return a placeholder
        return "Unknown Location"