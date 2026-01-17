import uuid

def generate_random_slug(prefix="checkin"):
    return f"{prefix}-{uuid.uuid4().hex}"

def flatten_default_fields(grouped_fields, section):
    """
    Convert category-based default fields into flat fields.
    Category + section are stored in meta (DB-style).
    """
    flat = []

    for category_block in grouped_fields:
        category = category_block["category"]

        for field in category_block.get("fields", []):
            meta = {
                "category": category,
                "section": section,
            }

            if "options" in field:
                meta["choices"] = [
                    {"label": opt.title(), "value": opt}
                    for opt in field["options"]
                ]

            flat.append({
                "slug": field["slug"],
                "label": field["label"],
                "type": field["type"],
                "required": field.get("required", False),
                "meta": meta,
            })

    return flat

def generate_unique_slug(model, base_slug):
    slug = base_slug
    counter = 1

    while model.objects.filter(slug=slug).exists():
        counter += 1
        slug = f"{base_slug}-{counter}"

    return slug

def serialize_checkin_field(field):
    meta = field.meta or {}

    payload = {
        "slug": field.slug,
        "label": field.label,
        "type": field.field_type,
        "required": field.is_required,
        "category": meta.get("category"),
    }

    if "choices" in meta:
        payload["choices"] = meta["choices"]

    return payload