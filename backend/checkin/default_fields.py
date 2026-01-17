# checkin/default_fields.py
DEFAULT_MAIN_GUEST_FIELDS = [
    {
        "category": "Personal info",
        "fields": [
            {
                "slug": "first_name",
                "label": "First name",
                "type": "text",
                "required": False,
            },
            {
                "slug": "last_name",
                "label": "Last name",
                "type": "text",
                "required": False,
            },
            {
                "slug": "gender",
                "label": "Gender",
                "type": "select",
                "required": False,
                "options": ["male", "female", "other"],
            },
            {
                "slug": "date_of_birth",
                "label": "Date of birth",
                "type": "date",
                "required": False,
            },
            {
                "slug": "place_of_birth",
                "label": "Place of birth",
                "type": "text",
                "required": False,
            },
            {
                "slug": "nationality",
                "label": "Nationality",
                "type": "country",
                "required": False,
            },
            {
                "slug": "occupation",
                "label": "Occupation",
                "type": "text",
                "required": False,
            },
            {
                "slug": "reason_for_visit",
                "label": "Reason for visit",
                "type": "text",
                "required": False,
            },
        ],
    },
    {
        "category": "Address",
        "fields": [
            {
                "slug": "street",
                "label": "Street",
                "type": "text",
                "required": False,
            },
            {
                "slug": "postal_code",
                "label": "Postal code",
                "type": "text",
                "required": False,
            },
            {
                "slug": "city",
                "label": "City",
                "type": "text",
                "required": False,
            },
            {
                "slug": "state",
                "label": "State",
                "type": "text",
                "required": False,
            },
            {
                "slug": "country",
                "label": "Country",
                "type": "country",
                "required": False,
            },
        ],
    },
    {
        "category": "Documents",
        "fields": [
            {
                "slug": "document_type",
                "label": "Document type",
                "type": "select",
                "required": False,
                "options": ["passport", "id_card"],
            },
            {
                "slug": "document_number",
                "label": "Document number",
                "type": "text",
                "required": False,
            },
            {
                "slug": "place_of_issue",
                "label": "Place of issue",
                "type": "text",
                "required": False,
            },
            {
                "slug": "date_of_issue",
                "label": "Date of issue",
                "type": "date",
                "required": False,
            },
            {
                "slug": "expiration_date",
                "label": "Expiration date",
                "type": "date",
                "required": False,
            },
        ],
    },
    {
        "category": "Other",
        "fields": [
            {
                "slug": "tax_code",
                "label": "Tax code",
                "type": "text",
                "required": False,
            },
            {
                "slug": "company_id",
                "label": "Company ID",
                "type": "text",
                "required": False,
            },
            {
                "slug": "attachment",
                "label": "Attachment",
                "type": "file",
                "required": False,
            },
            {
                "slug": "signature",
                "label": "Signature",
                "type": "file",
                "required": False,
            },
        ],
    },
]
DEFAULT_ADDITIONAL_GUEST_FIELDS = [
    {
        "category": "Personal info",
        "fields": [
            {
                "slug": "first_name",
                "label": "First name",
                "type": "text",
                "required": False,
            },
            {
                "slug": "last_name",
                "label": "Last name",
                "type": "text",
                "required": False,
            },
            {
                "slug": "gender",
                "label": "Gender",
                "type": "select",
                "required": False,
                "options": ["male", "female", "other"],
            },
            {
                "slug": "date_of_birth",
                "label": "Date of birth",
                "type": "date",
                "required": False,
            },
            {
                "slug": "place_of_birth",
                "label": "Place of birth",
                "type": "text",
                "required": False,
            },
            {
                "slug": "nationality",
                "label": "Nationality",
                "type": "country",
                "required": False,
            },
            {
                "slug": "occupation",
                "label": "Occupation",
                "type": "text",
                "required": False,
            },
        ],
    },
    {
        "category": "Address",
        "fields": [
            {
                "slug": "street",
                "label": "Street",
                "type": "text",
                "required": False,
            },
            {
                "slug": "postal_code",
                "label": "Postal code",
                "type": "text",
                "required": False,
            },
            {
                "slug": "city",
                "label": "City",
                "type": "text",
                "required": False,
            },
            {
                "slug": "state",
                "label": "State",
                "type": "text",
                "required": False,
            },
            {
                "slug": "country",
                "label": "Country",
                "type": "country",
                "required": False,
            },
        ],
    },
    {
        "category": "Documents",
        "fields": [
            {
                "slug": "document_type",
                "label": "Document type",
                "type": "select",
                "required": False,
                "options": ["passport", "id_card"],
            },
            {
                "slug": "document_number",
                "label": "Document number",
                "type": "text",
                "required": False,
            },
            {
                "slug": "place_of_issue",
                "label": "Place of issue",
                "type": "text",
                "required": False,
            },
            {
                "slug": "date_of_issue",
                "label": "Date of issue",
                "type": "date",
                "required": False,
            },
            {
                "slug": "expiration_date",
                "label": "Expiration date",
                "type": "date",
                "required": False,
            },
        ],
    },
    {
        "category": "Other",
        "fields": [
            {
                "slug": "tax_code",
                "label": "Tax code",
                "type": "text",
                "required": False,
            },
            {
                "slug": "company_id",
                "label": "Company ID",
                "type": "text",
                "required": False,
            },
            {
                "slug": "attachment",
                "label": "Attachment",
                "type": "file",
                "required": False,
            },
        ],
    },
]
