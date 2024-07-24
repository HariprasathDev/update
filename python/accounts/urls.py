from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Get_all_profiles, ProfilePartnerPrefViewSet, SignInView, ChangePasswordView, CountryViewSet, StateViewSet, DistrictViewSet,
    ReligionViewSet, CasteViewSet, ProfileHolderViewSet, MaritalStatusViewSet, HeightViewSet,
    ComplexionViewSet, ParentsOccupationViewSet, HighestEducationViewSet, UgDegreeViewSet,
    AnnualIncomeViewSet, PlaceOfBirthViewSet, BirthStarViewSet, RasiViewSet, LagnamViewSet,
    DasaBalanceViewSet, FamilyTypeViewSet, FamilyStatusViewSet, FamilyValueViewSet, LoginDetailsTempViewSet , Newprofile_get ,GetProfileDataView,LoginDetailsListCreateView, LoginDetailsDetailView
)
from .views import LoginDetailsViewSet, ProfileFamilyDetailsViewSet, ProfileEduDetailsViewSet,Newprofile_get


router = DefaultRouter()
router.register(r'countries', CountryViewSet)
router.register(r'states', StateViewSet)
router.register(r'districts', DistrictViewSet)
router.register(r'religions', ReligionViewSet)
router.register(r'castes', CasteViewSet)
router.register(r'profile-holders', ProfileHolderViewSet)
router.register(r'marital-statuses', MaritalStatusViewSet)
router.register(r'heights', HeightViewSet)
router.register(r'complexions', ComplexionViewSet)
router.register(r'parents-occupations', ParentsOccupationViewSet)
router.register(r'highest-educations', HighestEducationViewSet)
router.register(r'ug-degrees', UgDegreeViewSet)
router.register(r'annual-incomes', AnnualIncomeViewSet)
router.register(r'place-of-births', PlaceOfBirthViewSet)
router.register(r'birth-stars', BirthStarViewSet)
router.register(r'rasis', RasiViewSet)
router.register(r'lagnams', LagnamViewSet)
router.register(r'dasa-balances', DasaBalanceViewSet)
router.register(r'family-types', FamilyTypeViewSet)
router.register(r'family-statuses', FamilyStatusViewSet)
router.register(r'family-values', FamilyValueViewSet)
router.register(r'logindetails_temp', LoginDetailsTempViewSet, basename='logindetails_temp')
router.register(r'logzin-details-temp', LoginDetailsTempViewSet)
router.register(r'logindetails', LoginDetailsViewSet)
router.register(r'profile-familydetails', ProfileFamilyDetailsViewSet)
router.register(r'profile-edudetails', ProfileEduDetailsViewSet)
router.register(r'profile-partner-pref', ProfilePartnerPrefViewSet)

# router.register(r'Newprofile_get', Newprofile_get)

urlpatterns = [
    path('signin/', SignInView.as_view(), name='signin'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('', include(router.urls)),
    path('api/', include(router.urls)),   
    path('api/logindetails_temp/<int:pk>/approve/', LoginDetailsTempViewSet.as_view({'patch': 'approve'}), name='logindetails_temp-approve'),
    path('api/logindetails_temp/<int:pk>/disapprove/', LoginDetailsTempViewSet.as_view({'patch': 'disapprove'}), name='logindetails_temp-disapprove'),
    path('api/logindetails_temp/<int:pk>/approve/', LoginDetailsTempViewSet.as_view({'patch': 'approve'}), name='logindetails_temp-approve'),
    path('newprofile_get/', Newprofile_get.as_view(), name='newprofile_get'),
    path('Get_Profile_data/', GetProfileDataView.as_view(), name='Get_Profile_data'),
    path('logindetails/', LoginDetailsListCreateView.as_view(), name='login-details-list-create'),
    path('logindetails/<int:pk>/', LoginDetailsDetailView.as_view(), name='login-details-detail'),
    path('Get_all_profiles/deleted/', Get_all_profiles.as_view(), name='Get_all_profiles_deleted', kwargs={'profile_status': 0}),
    path('Get_all_profiles/paid/', Get_all_profiles.as_view(), name='Get_all_profiles_paid', kwargs={'profile_status': 2}),
    path('Get_all_profiles/approved/', Get_all_profiles.as_view(), name='Get_all_profiles_approved', kwargs={'profile_status': 3}),
    path('Get_all_profiles/featured/', Get_all_profiles.as_view(), name='Get_all_profiles_featured', kwargs={'profile_status': 4}),
]
