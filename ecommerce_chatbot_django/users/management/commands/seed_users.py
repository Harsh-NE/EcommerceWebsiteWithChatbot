# users/management/commands/seed_users.py

import requests
from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Seed Users from https://randomuser.me API'

    def handle(self, *args, **kwargs):
        num_users = 50  # Change this as needed
        url = f'https://randomuser.me/api/?results={num_users}'

        response = requests.get(url)
        data = response.json()

        for item in data['results']:
            username = item['login']['username']
            email = item['email']
            first_name = item['name']['first']
            last_name = item['name']['last']
            password = 'password123'  # default password for testing

            if not User.objects.filter(username=username).exists():
                user = User(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_password(password)  # important: hash the password
                user.save()
                self.stdout.write(f'Created user: {username} ({email})')

        self.stdout.write(self.style.SUCCESS('User seeding complete!'))
