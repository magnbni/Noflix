import os
from dotenv import load_dotenv
from mongoengine import Document
from mongoengine.fields import StringField, IntField, ListField

load_dotenv()

class Movie(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_MOVIES")}
    _id = StringField()
    tconst = StringField()
    titleType = StringField()
    primaryTitle = StringField()
    originalTitle = StringField()
    isAdult = IntField()
    startYear = IntField()
    endYear = IntField()
    runtimeMinutes = IntField()
    genres = ListField(StringField())
