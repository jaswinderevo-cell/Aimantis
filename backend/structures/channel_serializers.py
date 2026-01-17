from rest_framework import serializers
from django.utils import timezone
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .models import Structure, ChannelSettings

class IndividualAccommodationSerializer(serializers.Serializer):
    """Serializer for individual accommodation booking settings"""
    property_id = serializers.IntegerField(help_text="Property ID")
    property_name = serializers.CharField(read_only=True, help_text="Property name")
    booking_type = serializers.ChoiceField(
        choices=ChannelSettings.BOOKING_TYPE_CHOICES,
        help_text="Booking type: relative or absolute"
    )
    booking_value = serializers.IntegerField(
        min_value=1,
        help_text="Booking value (days for relative, specific value for absolute)"
    )
    booking_until_date = serializers.DateField(
        required=False,
        allow_null=True,
        help_text="Booking until date (required for absolute type)"
    )

    def validate(self, attrs):
        """Validate that booking_until_date is provided for absolute type"""
        if attrs['booking_type'] == 'absolute' and not attrs.get('booking_until_date'):
            raise serializers.ValidationError(
                {"booking_until_date": "Booking until date is required for absolute booking type."}
            )
        return attrs

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Channel Settings Request',
            value={
                "structure": 1,
                "default_booking_type": "relative",
                "default_booking_value": 6,
                "default_booking_until_date": None,
                "individual_accommodations": [
                    {
                        "property_id": 1,
                        "booking_type": "absolute",
                        "booking_value": 7,
                        "booking_until_date": "2025-09-02"
                    }
                ],
                "booking_percentage": 0,
                "airbnb_percentage": 0,
                "expedia_percentage": 0
            }
        )
    ]
)
class ChannelSettingsSerializer(serializers.ModelSerializer):
    """Serializer for channel settings including availability and price settings"""
    
    individual_accommodations = serializers.ListField(
        child=IndividualAccommodationSerializer(),
        required=False,
        allow_empty=True,
        help_text="Individual property booking settings"
    )
    
    class Meta:
        model = ChannelSettings
        fields = [
            'id', 'structure', 
            # Availability settings
            'default_booking_type', 'default_booking_value', 'default_booking_until_date',
            'individual_accommodations',
            # Price settings  
            'booking_percentage', 'airbnb_percentage', 'expedia_percentage',
            # Metadata
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_default_booking_value(self, value):
        """Validate default booking value"""
        if value < 1:
            raise serializers.ValidationError("Default booking value must be at least 1.")
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        # Validate default settings for absolute type
        if (attrs.get('default_booking_type') == 'absolute' and 
            not attrs.get('default_booking_until_date')):
            raise serializers.ValidationError({
                "default_booking_until_date": "Default booking until date is required for absolute booking type."
            })
        
        # Validate percentage values
        for field in ['booking_percentage', 'airbnb_percentage', 'expedia_percentage']:
            if field in attrs and (attrs[field] < 0 or attrs[field] > 100):
                raise serializers.ValidationError({
                    field: "Percentage must be between 0 and 100."
                })
        
        return attrs

    def create(self, validated_data):
        """Create channel settings with individual accommodations"""
        individual_accommodations_data = validated_data.pop('individual_accommodations', [])
        
        # Create the main channel settings
        channel_settings = ChannelSettings.objects.create(
            created_by=self.context['request'].user,
            **validated_data
        )
        
        # Process individual accommodations
        self._process_individual_accommodations(channel_settings, individual_accommodations_data)
        
        return channel_settings

    def update(self, instance, validated_data):
        """Update channel settings with individual accommodations"""
        individual_accommodations_data = validated_data.pop('individual_accommodations', None)
        
        # Update main fields
        instance.updated_by = self.context['request'].user
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        
        # Process individual accommodations if provided
        if individual_accommodations_data is not None:
            self._process_individual_accommodations(instance, individual_accommodations_data)
        
        return instance

    def _process_individual_accommodations(self, channel_settings, accommodations_data):
        """Process individual accommodations data"""
        accommodations_dict = {}
        
        for accommodation_data in accommodations_data:
            property_id = str(accommodation_data['property_id'])
            accommodations_dict[property_id] = {
                'booking_type': accommodation_data['booking_type'],
                'booking_value': accommodation_data['booking_value'],
                'booking_until_date': (
                    accommodation_data['booking_until_date'].isoformat() 
                    if accommodation_data.get('booking_until_date') else None
                )
            }
        
        channel_settings.individual_accommodations = accommodations_dict
        channel_settings.save()

    def to_representation(self, instance):
        """Custom representation to format individual accommodations"""
        data = super().to_representation(instance)
        
        # Convert individual_accommodations from dict to list format
        accommodations_list = []
        if instance.individual_accommodations:
            from properties.models import Property
            
            for property_id, settings in instance.individual_accommodations.items():
                try:
                    property_obj = Property.objects.get(id=int(property_id))
                    accommodation_data = {
                        'property_id': int(property_id),
                        'property_name': property_obj.name,
                        'booking_type': settings['booking_type'],
                        'booking_value': settings['booking_value'],
                        'booking_until_date': settings.get('booking_until_date')
                    }
                    accommodations_list.append(accommodation_data)
                except Property.DoesNotExist:
                    continue
        
        data['individual_accommodations'] = accommodations_list
        return data

class ChannelSettingsSummarySerializer(serializers.ModelSerializer):
    """Simplified serializer for channel settings summary"""
    structure_name = serializers.CharField(source='structure.name', read_only=True)
    total_individual_accommodations = serializers.SerializerMethodField()
    
    class Meta:
        model = ChannelSettings
        fields = [
            'id', 'structure', 'structure_name',
            'default_booking_type', 'default_booking_value',
            'booking_percentage', 'airbnb_percentage', 'expedia_percentage',
            'total_individual_accommodations', 'updated_at'
        ]

    def get_total_individual_accommodations(self, obj):
        """Get count of individual accommodations"""
        return len(obj.individual_accommodations) if obj.individual_accommodations else 0