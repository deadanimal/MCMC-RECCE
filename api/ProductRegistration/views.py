from django.shortcuts import render
from django.db.models import Q

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from ProductRegistration.models import (
    ProductRegistration
)

from ProductRegistration.serializers import (
    ProductRegistrationSerializer
)

class ProductRegistrationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ProductRegistration.objects.all()
    serializer_class = ProductRegistrationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id', 
        'SLPID',
        'imeiNo',
        'consigneeName',
        'modelDescription',
        'modelId',
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = ProductRegistration.objects.all()
        # queryset = CustomUser.objects.filter(string__contains=CustomUser.name)

        """
        if self.request.user.is_anonymous:
            queryset = Company.objects.none()

        else:
            user = self.request.user
            company_employee = CompanyEmployee.objects.filter(employee=user)
            company = company_employee[0].company
            
            if company.company_type == 'AD':
                queryset = User.objects.all()
            else:
                queryset = User.objects.filter(company=company.id)
        """
        return queryset   

    # @api_view(['GET', 'POST', 'DELETE'])
    # def table_list(request):
    #     # GET list of tutorials, POST a new tutorial, DELETE all tutorials
    
    
    # @api_view(['GET', 'PUT', 'DELETE'])
    # def tutorial_detail(request, pk):
    #     # find tutorial by pk (id)
    #     try: 
    #         tutorial = Tutorial.objects.get(pk=pk) 
    #     except Tutorial.DoesNotExist: 
    #         return JsonResponse({'message': 'The tutorial does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    #     # GET / PUT / DELETE tutorial
        
            
    # @api_view(['GET'])
    # def tutorial_list_published(request):
    #     if request.method == 'GET':
    #         tutorials = Tutorial.objects.all()
        
    #     title = request.GET.get('title', None)
    #     if title is not None:
    #         tutorials = tutorials.filter(title__icontains=title)
        
    #     tutorials_serializer = ProductRegistrationSerializer(tutorials, many=True)
    #     return JsonResponse(tutorials_serializer.data, safe=False)
    #     # 'safe=False' for objects serialization

# Create your views here.
