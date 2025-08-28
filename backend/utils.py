def serialize_doc(doc):
    """Converts a MongoDB doc to a JSON-serializable format."""
    if "_id" in doc and not isinstance(doc["_id"], str):
        doc["_id"] = str(doc["_id"])
    return doc