from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Create Admin role with hierarchical permissions'

    def handle(self, *args, **options):
        # Create Admin group
        admin_group, created = Group.objects.get_or_create(name='Admin')
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('Successfully created Admin role')
            )
            
            # Add basic permissions to Admin group
            # You can add more specific permissions based on your models
            permissions_to_add = [
                'add_user', 'change_user', 'delete_user', 'view_user',
                # Add permissions for other models as needed
                # 'add_property', 'change_property', 'delete_property', 'view_property',
                # 'add_booking', 'change_booking', 'delete_booking', 'view_booking',
            ]
            
            for perm_codename in permissions_to_add:
                try:
                    permission = Permission.objects.get(codename=perm_codename)
                    admin_group.permissions.add(permission)
                    self.stdout.write(f'Added permission: {perm_codename}')
                except Permission.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'Permission not found: {perm_codename}')
                    )
                    
        else:
            self.stdout.write('Admin role already exists')
        
        self.stdout.write(
            self.style.SUCCESS('Admin role setup completed!')
        )
