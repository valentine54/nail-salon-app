# backend/api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Appointment, UserProfile


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'role']


class AppointmentSerializer(serializers.ModelSerializer):
    technician_name = serializers.CharField(source='technician.first_name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'