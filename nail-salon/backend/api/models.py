from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    ROLES = [('Admin','Admin'),('Nail Technician','Nail Technician'),('Spa Therapist','Spa Therapist')]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLES, default='Nail Technician')
    is_technician = models.BooleanField(default=True)

class Appointment(models.Model):
    STATUS = [('booked','Booked'),('completed','Completed'),('cancelled','Cancelled'),('break','Break'),('lunch','Lunch'),('unavailable','Unavailable')]
    client_name = models.CharField(max_length=200)
    client_phone = models.CharField(max_length=20, blank=True, default='')
    service_type = models.CharField(max_length=200)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    status = models.CharField(max_length=20, choices=STATUS, default='booked')
    notes = models.TextField(blank=True)
    has_inspo = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    client_history = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    # Image fields for inspiration
    mani_inspo = models.ImageField(upload_to='inspo/', null=True, blank=True)
    pedi_inspo = models.ImageField(upload_to='inspo/', null=True, blank=True)
    spa_inspo = models.ImageField(upload_to='inspo/', null=True, blank=True)