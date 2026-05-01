from rest_framework import viewsets, serializers, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from datetime import date, timedelta, datetime
from .models import Appointment, UserProfile


# ── SERIALIZERS ────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    is_technician = serializers.SerializerMethodField()
    total_today = serializers.SerializerMethodField()
    total_week = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'role', 'is_technician', 'total_today', 'total_week']

    def get_role(self, obj):
        profile = UserProfile.objects.filter(user=obj).first()
        return profile.role if profile else 'Nail Technician'

    def get_is_technician(self, obj):
        profile = UserProfile.objects.filter(user=obj).first()
        return profile.is_technician if profile else True

    def get_total_today(self, obj):
        return Appointment.objects.filter(technician=obj, date=date.today()).count()

    def get_total_week(self, obj):
        week_end = date.today() + timedelta(days=7)
        return Appointment.objects.filter(technician=obj, date__range=[date.today(), week_end]).count()


class AppointmentSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'

    def get_technician_name(self, obj):
        return obj.technician.first_name if obj.technician else 'Unassigned'


# ── AUTH ───────────────────────────────────────────────────────────
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username', '').strip().lower()
    password = request.data.get('password', '')

    # Try to find user by username
    try:
        user = User.objects.get(username=username)
        authenticated = authenticate(username=user.username, password=password)
    except User.DoesNotExist:
        authenticated = None

    if authenticated:
        profile = UserProfile.objects.filter(user=authenticated).first()
        return Response({
            'id': authenticated.id,
            'username': authenticated.username,
            'first_name': authenticated.first_name,
            'role': profile.role if profile else 'Nail Technician',
            'token': f'token-{authenticated.id}'
        })
    return Response({'error': 'Invalid credentials'}, status=400)


# ── USER VIEWSET ───────────────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def create_tech(self, request):
        username = request.data.get('username', '').strip().lower()
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        role = request.data.get('role', 'Nail Technician')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password, first_name=first_name)
        UserProfile.objects.create(user=user, role=role, is_technician=True)
        return Response({'success': True, 'id': user.id, 'username': username})

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        user.set_password(request.data.get('password'))
        user.save()
        return Response({'success': True})

    @action(detail=True, methods=['delete'])
    def delete_tech(self, request, pk=None):
        user = self.get_object()
        UserProfile.objects.filter(user=user).delete()
        user.delete()
        return Response({'success': True})


# ── APPOINTMENT VIEWSET ────────────────────────────────────────────
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def list(self, request):
        tech_id = request.query_params.get('technician_id')
        date_filter = request.query_params.get('date')
        status_filter = request.query_params.get('status')

        qs = Appointment.objects.all()
        if tech_id and tech_id != 'all':
            qs = qs.filter(technician_id=tech_id)
        if date_filter:
            qs = qs.filter(date=date_filter)
        if status_filter:
            qs = qs.filter(status=status_filter)

        qs = qs.order_by('date', 'start_time')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.copy()

            # Handle technician assignment
            tech_id = data.get('technician_id')
            if tech_id and tech_id != 'any' and tech_id != 'null':
                try:
                    data['technician'] = User.objects.get(id=int(tech_id))
                except (User.DoesNotExist, ValueError):
                    data['technician'] = None
            else:
                data['technician'] = None

            # Clean up
            data.pop('technician_id', None)

            # Handle image uploads
            mani_inspo = request.FILES.get('mani_inspo')
            pedi_inspo = request.FILES.get('pedi_inspo')
            spa_inspo = request.FILES.get('spa_inspo')

            appt = Appointment.objects.create(**data)
            if mani_inspo: appt.mani_inspo = mani_inspo
            if pedi_inspo: appt.pedi_inspo = pedi_inspo
            if spa_inspo: appt.spa_inspo = spa_inspo
            appt.save()

            return Response({'success': True, 'id': appt.id}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def partial_update(self, request, pk=None):
        appt = self.get_object()
        for k, v in request.data.items():
            if k not in ['technician_id', 'technician_name']:
                setattr(appt, k, v)
        appt.save()
        return Response({'success': True})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        today = date.today()
        tomorrow = today + timedelta(days=1)
        week_end = today + timedelta(days=7)
        tech_id = request.query_params.get('technician_id')

        qs = Appointment.objects.all()
        if tech_id and tech_id != 'all':
            qs = qs.filter(technician_id=tech_id)

        return Response({
            'today': qs.filter(date=today).count(),
            'tomorrow': qs.filter(date=tomorrow).count(),
            'this_week': qs.filter(date__range=[today, week_end]).count(),
            'completed_today': qs.filter(date=today, status='completed').count(),
            'by_status': {
                'booked': qs.filter(date=today, status='booked').count(),
                'completed': qs.filter(date=today, status='completed').count(),
                'cancelled': qs.filter(date=today, status='cancelled').count(),
            }
        })