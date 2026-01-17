from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

def send_invitation_email(invitation):
    """Send invitation email to user"""
    try:
        subject = f"You're invited to join {'Aimantis' if not invitation.structure else invitation.structure.name}"
        
        # Context for email template
        context = {
            'inviter_name': invitation.invited_by.get_full_name() or invitation.invited_by.username,
            'inviter_email': invitation.invited_by.email,
            'structure_name': invitation.structure.name if invitation.structure else None,
            'role': invitation.get_role_display(),
            'message': invitation.message,
            'invitation_url': f"{settings.FRONTEND_URL}/accept-invitation/{invitation.id}",
            'expires_at': invitation.expires_at,
            'days_until_expiry': invitation.days_until_expiry,
        }
        
        # Render HTML email
        html_content = render_to_string('emails/invitation.html', context)
        text_content = strip_tags(html_content)
        
        # Create and send email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[invitation.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Invitation email sent to {invitation.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send invitation email to {invitation.email}: {e}")
        return False

def send_welcome_email(user, structure=None, role=None):
    """Send welcome email to new user"""
    try:
        subject = "Welcome to Aimantis - Your Account is Ready!"
        
        context = {
            'user_name': user.get_full_name() or user.username,
            'user_email': user.email,
            'username': user.username,
            'structure_name': structure.name if structure else None,
            'role': role,
        }
        
        html_content = render_to_string('emails/welcome.html', context)
        text_content = strip_tags(html_content)
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
        
        logger.info(f"Welcome email sent to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {e}")
        return False
