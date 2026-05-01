from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'appointments', views.AppointmentViewSet)
urlpatterns = [path('login/', views.login_view), path('', include(router.urls))]