# Generated by Django 2.2.10 on 2020-12-16 02:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='masterTable',
            fields=[
                ('Id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('fileNo', models.CharField(blank=True, max_length=255)),
                ('TAC', models.CharField(blank=True, max_length=255)),
                ('productCategory', models.CharField(blank=True, max_length=255)),
                ('modelId', models.CharField(blank=True, max_length=255)),
                ('modelDescription', models.CharField(blank=True, max_length=255)),
                ('consigneeName', models.CharField(blank=True, max_length=255)),
                ('submissionDate', models.CharField(blank=True, max_length=255)),
                ('approveDate', models.CharField(blank=True, max_length=255)),
                ('expiryDate', models.CharField(blank=True, max_length=255)),
                ('category', models.CharField(blank=True, max_length=255)),
                ('serialNo', models.CharField(blank=True, max_length=255)),
                ('SLPID', models.CharField(blank=True, max_length=255)),
                ('created_date', models.DateTimeField(auto_now=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['modified_date'],
            },
        ),
    ]
