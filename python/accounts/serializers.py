# serializers.py
from rest_framework import serializers
from .models import PlaceOfBirth, BirthStar, ProfilePartnerPref, Rasi, Lagnam, DasaBalance, LoginDetailsTemp, FamilyType, FamilyStatus, FamilyValue, ProfileHolder, MaritalStatus, Height, Complexion, ParentsOccupation, HighestEducation, UgDegree, AnnualIncome, Country, State, District, Religion, Caste
from .models import Profile

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New password and confirm password do not match")
        return data

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class ReligionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Religion
        fields = '__all__'

class CasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caste
        fields = '__all__'

class ProfileHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileHolder
        fields = '__all__'

class MaritalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaritalStatus
        fields = '__all__'

class HeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Height
        fields = '__all__'

class ComplexionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complexion
        fields = '__all__'

class ParentsOccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentsOccupation
        fields = '__all__'

class HighestEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HighestEducation
        fields = '__all__'

class UgDegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UgDegree
        fields = '__all__'

class AnnualIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnualIncome
        fields = '__all__'

class PlaceOfBirthSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceOfBirth
        fields = '__all__'

class BirthStarSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthStar
        fields = '__all__'

class RasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rasi
        fields = '__all__'

class LagnamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lagnam
        fields = '__all__'

class DasaBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DasaBalance
        fields = '__all__'

class FamilyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyType
        fields = '__all__'

class FamilyStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyStatus
        fields = '__all__'

class FamilyValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyValue
        fields = '__all__'

class LoginDetailsTempSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginDetailsTemp
        fields = '__all__'
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

from .models import LoginDetails, ProfileFamilyDetails, ProfileEduDetails

class LoginDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginDetails
        fields = '__all__'

class ProfileFamilyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileFamilyDetails
        fields = '__all__'

class ProfileEduDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileEduDetails
        fields = '__all__'

class ProfilePartnerPrefSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePartnerPref
        fields = '__all__'

class Getnewprofiledata(serializers.ModelSerializer):
    class Meta:
        model = LoginDetails
        fields = '__all__' 
        
