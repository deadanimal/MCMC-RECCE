from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class FAQ(models.Model):

    FAQId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CategoryId = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    Description  = models.CharField(max_length=255, blank=True)
    ProductRegNo = models.CharField(max_length=255, blank=True)
    createdBy = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now=True)
    modified_date = models.DateTimeField(auto_now=True)
 

    class Meta:
        ordering = ['modified_date']

    def __str__(self):
        return self.FAQId

