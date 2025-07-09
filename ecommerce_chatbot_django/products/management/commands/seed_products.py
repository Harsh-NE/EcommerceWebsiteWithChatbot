import requests
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Seed products using fakestoreapi.com'

    def handle(self, *args, **kwargs):
        response = requests.get('https://fakestoreapi.com/products')
        data = response.json()

        for item in data:
            product = Product(
                name=item['title'],
                category=item['category'],
                price=item['price'],
                description=item['description'],
                image_url=item['image'],
                stock_quantity=10  # or random.randint(1, 50)
            )
            product.save()

        self.stdout.write(self.style.SUCCESS('Database seeded with API data!'))
