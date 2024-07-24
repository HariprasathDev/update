from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ChangePasswordSerializer, ProfileEduDetailsSerializer, ProfileFamilyDetailsSerializer, ProfilePartnerPrefSerializer
from rest_framework import viewsets
from .models import Country, ProfileEduDetails, ProfileFamilyDetails, ProfilePartnerPref, State, District, Religion, Caste, ProfileHolder, MaritalStatus, Height, Complexion, ParentsOccupation, HighestEducation, UgDegree, AnnualIncome, PlaceOfBirth, BirthStar, Rasi, Lagnam, DasaBalance, FamilyType, FamilyStatus, FamilyValue, LoginDetailsTemp ,Get_profiledata
from .serializers import CountrySerializer, StateSerializer, DistrictSerializer, ReligionSerializer, CasteSerializer, ProfileHolderSerializer, MaritalStatusSerializer, HeightSerializer, ComplexionSerializer, ParentsOccupationSerializer, HighestEducationSerializer, UgDegreeSerializer, AnnualIncomeSerializer, PlaceOfBirthSerializer, BirthStarSerializer, RasiSerializer, LagnamSerializer, DasaBalanceSerializer, FamilyTypeSerializer, FamilyStatusSerializer, FamilyValueSerializer, LoginDetailsTempSerializer,Getnewprofiledata
from rest_framework.decorators import action
from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


class SignInView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        return Response({'message': 'Failed'}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password successfully changed'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer

class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer

class ReligionViewSet(viewsets.ModelViewSet):
    queryset = Religion.objects.all()
    serializer_class = ReligionSerializer

class CasteViewSet(viewsets.ModelViewSet):
    queryset = Caste.objects.all()
    serializer_class = CasteSerializer

class ProfileHolderViewSet(viewsets.ModelViewSet):
    queryset = ProfileHolder.objects.all()
    serializer_class = ProfileHolderSerializer

class MaritalStatusViewSet(viewsets.ModelViewSet):
    queryset = MaritalStatus.objects.all()
    serializer_class = MaritalStatusSerializer

class HeightViewSet(viewsets.ModelViewSet):
    queryset = Height.objects.all()
    serializer_class = HeightSerializer

class ComplexionViewSet(viewsets.ModelViewSet):
    queryset = Complexion.objects.all()
    serializer_class = ComplexionSerializer

class ParentsOccupationViewSet(viewsets.ModelViewSet):
    queryset = ParentsOccupation.objects.all()
    serializer_class = ParentsOccupationSerializer

class HighestEducationViewSet(viewsets.ModelViewSet):
    queryset = HighestEducation.objects.all()
    serializer_class = HighestEducationSerializer

class UgDegreeViewSet(viewsets.ModelViewSet):
    queryset = UgDegree.objects.all()
    serializer_class = UgDegreeSerializer

class AnnualIncomeViewSet(viewsets.ModelViewSet):
    queryset = AnnualIncome.objects.all()
    serializer_class = AnnualIncomeSerializer

class PlaceOfBirthViewSet(viewsets.ModelViewSet):
    queryset = PlaceOfBirth.objects.all()
    serializer_class = PlaceOfBirthSerializer

class BirthStarViewSet(viewsets.ModelViewSet):
    queryset = BirthStar.objects.all()
    serializer_class = BirthStarSerializer

class RasiViewSet(viewsets.ModelViewSet):
    queryset = Rasi.objects.all()
    serializer_class = RasiSerializer

class LagnamViewSet(viewsets.ModelViewSet):
    queryset = Lagnam.objects.all()
    serializer_class = LagnamSerializer

class DasaBalanceViewSet(viewsets.ModelViewSet):
    queryset = DasaBalance.objects.all()
    serializer_class = DasaBalanceSerializer

class FamilyTypeViewSet(viewsets.ModelViewSet):
    queryset = FamilyType.objects.all()
    serializer_class = FamilyTypeSerializer

class FamilyStatusViewSet(viewsets.ModelViewSet):
    queryset = FamilyStatus.objects.all()
    serializer_class = FamilyStatusSerializer

class FamilyValueViewSet(viewsets.ModelViewSet):
    queryset = FamilyValue.objects.all()
    serializer_class = FamilyValueSerializer
# views.py
from rest_framework import viewsets
from .models import LoginDetailsTemp
from .serializers import LoginDetailsTempSerializer

class LoginDetailsTempViewSet(viewsets.ModelViewSet):
    queryset = LoginDetailsTemp.objects.all()
    serializer_class = LoginDetailsTempSerializer

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        login_detail = self.get_object()
        login_detail.status = 1
        last_profile = LoginDetailsTemp.objects.filter(ProfileId__regex=r'^vy\d{3}$').order_by('ProfileId').last()
        if last_profile:
            last_serial_number = int(last_profile.ProfileId[2:])
            new_serial_number = last_serial_number + 1
        else:
            new_serial_number = 1
        login_detail.ProfileId = f'vy{new_serial_number:03}'
        login_detail.save()
        return Response({'status': 'accepted', 'ProfileId': login_detail.ProfileId})

    @action(detail=True, methods=['patch'])
    def disapprove(self, request, pk=None):
        login_detail = self.get_object()
        login_detail.status = 0
        login_detail.save()
        return Response({'status': 'disapproved'})
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer

@api_view(['POST'])
def basic_details(request):
    if request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import LoginDetails
from .serializers import LoginDetailsSerializer
from django.db import connection, router, transaction
import logging

logger = logging.getLogger(__name__)

class LoginDetailsViewSet(viewsets.ModelViewSet):
    queryset = LoginDetails.objects.all()
    serializer_class = LoginDetailsSerializer

    def generate_unique_profile_id(self):
        try:
            last_profile = LoginDetails.objects.latest('ContentId')
            
            if last_profile:
                # Assuming ContentId is an integer or a string that can be converted to an integer
                last_content_id = int(last_profile.ContentId)
                numeric_part = str(last_content_id + 1).zfill(3)
                new_profile_id = f"VY240{numeric_part}"
            else:
                # Handle the case when there is no previous profile
                new_profile_id = "VY240001"
        except LoginDetails.DoesNotExist:
            # Handle the case when there are no records in the table
            new_profile_id = "VY240001"
        
        return new_profile_id


    @transaction.atomic
    def create(self, request, *args, **kwargs):
        #retries = 5  # Number of retries to find a unique ProfileId
        #for attempt in range(retries):
            profile_id = self.generate_unique_profile_id()
            #if not LoginDetails.objects.filter(ProfileId=profile_id).exists():
            request.data['ProfileId'] = profile_id
            serializer = self.get_serializer(data=request.data)
            try:
                    serializer.is_valid(raise_exception=True)
                    self.perform_create(serializer)
                    headers = self.get_success_headers(serializer.data)
                    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except Exception as e:
                    logger.error(f"Error creating login details: {e}")
                    return Response(status=status.HTTP_400_CREATED, logger=logger)
            #logger.warning(f"Attempt {attempt + 1}: ProfileId {profile_id} already exists. Retrying...")
        #logger.error("Could not generate a unique ProfileId after multiple attempts.")
        #return Response({'error': 'Could not generate a unique ProfileId'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileFamilyDetailsViewSet(viewsets.ModelViewSet):
    queryset = ProfileFamilyDetails.objects.all()
    serializer_class = ProfileFamilyDetailsSerializer

class ProfileEduDetailsViewSet(viewsets.ModelViewSet):
    queryset = ProfileEduDetails.objects.all()
    serializer_class = ProfileEduDetailsSerializer

class ProfilePartnerPrefViewSet(viewsets.ModelViewSet):
    queryset = ProfilePartnerPref.objects.all()
    serializer_class = ProfilePartnerPrefSerializer




# data table server side responses  #
class StandardResultsPaging(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


# class Newprofile_get(generics.ListAPIView):
#     queryset = LoginDetails.objects.all()
#     serializer_class = Getnewprofiledata
#     pagination_class = StandardResultsPaging

class Newprofile_get(generics.ListAPIView):
    queryset = LoginDetails.objects.all()
    serializer_class = Getnewprofiledata
    pagination_class = StandardResultsPaging
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['ProfileId', 'Gender', 'EmailId', 'Profile_dob', 'Profile_city']

    def get_queryset(self):
        queryset = LoginDetails.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(ProfileId__icontains=search_query) |
                Q(temp_profileid__icontains=search_query) |
                Q(Gender__icontains=search_query) |
                Q(Mobile_no__icontains=search_query) |
                Q(EmailId__icontains=search_query) |
                Q(Profile_marital_status__icontains=search_query) |
                Q(Profile_dob__icontains=search_query) |
                Q(Profile_complexion__icontains=search_query) |
                Q(Profile_address__icontains=search_query) |
                Q(Profile_country__icontains=search_query) |
                Q(Profile_state__icontains=search_query) |
                Q(Profile_city__icontains=search_query) |
                Q(Profile_pincode__icontains=search_query)
            )
        return queryset
    

# class Get_Profile_data(APIView):

#     def post(self, request):
#             profile_id='VY240013'
            
#             data = Get_profiledata.get_edit_profile(profile_id)
#             # output_serializer = serializers.MatchingStarSerializer(data, many=True)

#             # Construct the response structure
#             response = data

#             return Response(response, status=status.HTTP_200_OK, safe=False)
#         #return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetProfileDataView(APIView):

    def post(self, request):
        #profile_id = 'VY240013'
        profile_id = request.data.get('profile_id')

        try:
            data = Get_profiledata.get_edit_profile(profile_id)
            # Uncomment and modify the following line if you have a serializer
            # output_serializer = serializers.MatchingStarSerializer(data, many=True)

            # Construct the response structure
            response = data

            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = LoginDetails.objects.all()
    serializer_class = Getnewprofiledata

    def retrieve(self, request, *args, **kwargs):
        print("Retrieving profile with ID:", kwargs.get('pk'))
        return super().retrieve(request, *args, **kwargs)
    
    
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import ProfileSerializer

class GetProfileDataView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ProfileDetailView(APIView):

    def get(self, request, pk, format=None):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



from rest_framework import generics
from .models import LoginDetailsTemp
from .serializers import LoginDetailsTempSerializer

class LoginDetailsListCreateView(generics.ListCreateAPIView):
    queryset = LoginDetailsTemp.objects.all()
    serializer_class = LoginDetailsTempSerializer

class LoginDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LoginDetailsTemp.objects.all()
    serializer_class = LoginDetailsTempSerializer



import logging




logger = logging.getLogger(__name__)

class LoginDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LoginDetailsTemp.objects.all()
    serializer_class = LoginDetailsTempSerializer

    def delete(self, request, *args, **kwargs):
        logger.info(f"Delete request received for ID: {kwargs.get('pk')}")
        return super().delete(request, *args, **kwargs)




# class Get_all_profiles(generics.ListAPIView):
#     serializer_class = Getnewprofiledata
#     pagination_class = StandardResultsPaging
#     filter_backends = [filters.OrderingFilter]
#     ordering_fields = ['ProfileId', 'Gender', 'EmailId', 'Profile_dob', 'Profile_city']

#     def get_queryset(self, profile_status=None):
#         search_query = self.request.query_params.get('search', None)
#         query = '''
#             SELECT l.*, pe.*, pf.*, ph.*, pi.*, pp.*
#             FROM logindetails l
#             LEFT JOIN profile_edudetails pe ON pe.profile_id = l.ProfileId
#             LEFT JOIN profile_familydetails pf ON pf.profile_id = l.ProfileId
#             LEFT JOIN profile_horoscope ph ON ph.profile_id = l.ProfileId
#             LEFT JOIN profile_images pi ON pi.profile_id = l.ProfileId
#             LEFT JOIN profile_partner_pref pp ON pp.profile_id = l.ProfileId
#             WHERE l.status=%s
#         '''

#         if search_query:
#             query += '''
#                 AND (
#                     l.ProfileId LIKE %s
#                     OR l.Gender LIKE %s
#                     OR l.Mobile_no LIKE %s
#                     OR l.EmailId LIKE %s
#                     OR l.Profile_marital_status LIKE %s
#                     OR l.Profile_dob LIKE %s
#                     OR l.Profile_complexion LIKE %s
#                     OR l.Profile_address LIKE %s
#                     OR l.Profile_country LIKE %s
#                     OR l.Profile_state LIKE %s
#                     OR l.Profile_city LIKE %s
#                     OR l.Profile_pincode LIKE %s
#                 )
#             '''
#             search_query = f"%{search_query}%"

#         with connection.cursor() as cursor:
#             if search_query:
#                 cursor.execute(query, [profile_status] + [search_query] * 12)
#             else:
#                 cursor.execute(query, [profile_status])
#             columns = [col[0] for col in cursor.description]
#             rows = cursor.fetchall()
#             result = [dict(zip(columns, row)) for row in rows]
        
#         return result

#     def get(self, request, *args, **kwargs):
#         # profile_status = request.data.get('profile_status')

#         # if profile_status is None:
#         #     return Response({"detail": "profile_status is required."}, status=400)
        
#         profile_status=2

#         queryset = self.get_queryset(profile_status)
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)





from rest_framework import generics, filters
from rest_framework.response import Response
from django.db import connection
from django.urls import path
from .serializers import Getnewprofiledata
from .pagination import StandardResultsPaging

class Get_all_profiles(generics.ListAPIView):
    serializer_class = Getnewprofiledata
    pagination_class = StandardResultsPaging
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['ProfileId', 'Gender', 'EmailId', 'Profile_dob', 'Profile_city']

    def get_queryset(self, profile_status=None):
        search_query = self.request.query_params.get('search', None)
        query = '''
            SELECT l.*, pe.*, pf.*, ph.*, pi.*, pp.*
            FROM logindetails l
            LEFT JOIN profile_edudetails pe ON pe.profile_id = l.ProfileId
            LEFT JOIN profile_familydetails pf ON pf.profile_id = l.ProfileId
            LEFT JOIN profile_horoscope ph ON ph.profile_id = l.ProfileId
            LEFT JOIN profile_images pi ON pi.profile_id = l.ProfileId
            LEFT JOIN profile_partner_pref pp ON pp.profile_id = l.ProfileId
            WHERE l.status=%s
        '''

        if search_query:
            query += '''
                AND (
                    l.ProfileId LIKE %s
                    OR l.Gender LIKE %s
                    OR l.Mobile_no LIKE %s
                    OR l.EmailId LIKE %s
                    OR l.Profile_marital_status LIKE %s
                    OR l.Profile_dob LIKE %s
                    OR l.Profile_complexion LIKE %s
                    OR l.Profile_address LIKE %s
                    OR l.Profile_country LIKE %s
                    OR l.Profile_state LIKE %s
                    OR l.Profile_city LIKE %s
                    OR l.Profile_pincode LIKE %s
                )
            '''
            search_query = f"%{search_query}%"

        with connection.cursor() as cursor:
            if search_query:
                cursor.execute(query, [profile_status] + [search_query] * 12)
            else:
                cursor.execute(query, [profile_status])
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
        
        return result

    def get(self, request, *args, **kwargs):
        profile_status = kwargs.get('profile_status', None)
        if profile_status is None:
            return Response({"detail": "profile_status is required."}, status=400)
        
        queryset = self.get_queryset(profile_status)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)