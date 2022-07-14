from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class ViewListingVariable2(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TACInd = models.CharField(max_length=255, blank=True)
    fileNoInd = models.CharField(max_length=255, blank=True)
    modelInd = models.CharField(max_length=255, blank=True)
    brandInd = models.CharField(max_length=255, blank=True)
    marketingNameInd = models.CharField(max_length=255, blank=True)
    typeOfProductInd = models.CharField(max_length=255, blank=True)
    submissionDateInd = models.CharField(max_length=255, blank=True)
    activeIndicator = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now=True)
    modified_date = models.DateTimeField(auto_now=True)
    approveDateInd = models.DateTimeField(auto_now=True)
    expiryDateInd = models.DateTimeField(auto_now=True)
    birth_date = models.DateTimeField(null=True)
    nric = models.CharField(max_length=12, default='NA')   


    # USER_TYPE_OPTION = [
    #     ('AD','Admin'),
    #     ('US','User')
    # ]

    # user_type = models.CharField(max_length=2,choices=USER_TYPE_OPTION,default='US')

    class Meta:
        ordering = ['TACInd']

    def __str__(self):
        return self.TACInd

