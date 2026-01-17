from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group

class Command(BaseCommand):
    help = 'Assign all existing users to Admin role'

    def handle(self, *args, **options):
        try:
            admin_group = Group.objects.get(name='Admin')
        except Group.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Admin group does not exist. Run create_admin_role first.')
            )
            return

        # Get all users
        all_users = User.objects.all()
        assigned_count = 0
        
        for user in all_users:
            if not user.groups.filter(name='Admin').exists():
                user.groups.add(admin_group)
                assigned_count += 1
                self.stdout.write(f'Assigned Admin role to: {user.username}')
            else:
                self.stdout.write(f'User {user.username} already has Admin role')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully assigned Admin role to {assigned_count} users'
            )
        )
