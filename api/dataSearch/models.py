from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class dataSearch(models.Model):

    Id = models.UUIDField(default=uuid.uuid4, editable=False)
    fileNo = models.CharField(max_length=255, blank=True)
    TAC = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=255, blank=True)
    modelID = models.CharField(max_length=255, blank=True)
    modelDescription = models.CharField(max_length=255, blank=True)
    consigneeName = models.CharField(max_length=255, blank=True)
    submissionDate = models.CharField(max_length=255, blank=True)
    approveDate = models.CharField(max_length=255, blank=True)
    expiryDate = models.CharField(max_length=255, blank=True)
    deviceCategory = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now=True)
    modified_date = models.DateTimeField(auto_now=True)
    serialNo = models.CharField(max_length=255, blank=True)
 

    class Meta:
        ordering = ['TAC']

    def __str__(self):
        return self.Id

