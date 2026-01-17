from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile

class Command(BaseCommand):
    help = 'Make all existing users Super Admins'

    def handle(self, *args, **options):
        users_updated = 0
        
        for user in User.objects.all():
            profile, created = UserProfile.objects.get_or_create(user=user)
            if not profile.super_admin:
                profile.super_admin = True
                profile.save()
                users_updated += 1
                self.stdout.write(f'Made {user.username} a Super Admin')
            else:
                self.stdout.write(f'{user.username} is already a Super Admin')
        
        self.stdout.write(
            self.style.SUCCESS(f'Updated {users_updated} users to Super Admin status')
        )