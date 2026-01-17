# python-backend
# update 18 Sep 2025

# 1. Create the UserProfile model migration
python manage.py makemigrations users

# 2. Apply migrations
python manage.py migrate

# 3. Create Admin role
python manage.py create_admin_role

# 4. Assign all existing users to Admin role
python manage.py assign_admin_role

