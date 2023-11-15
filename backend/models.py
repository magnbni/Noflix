import os
from dotenv import load_dotenv
from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import StringField, IntField, ListField, BooleanField
from mongoengine.fields import ReferenceField, EmbeddedDocumentField, ObjectIdField

load_dotenv()

class Movie(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_MOVIES")}
    _id = ObjectIdField(unique=True)
    adult = BooleanField()
    backdrop_path = StringField()
    belongs_to_collection = StringField()
    budget = IntField()
    genres = ListField()
    homepage = StringField()
    imdb_id = StringField()
    original_language = StringField()
    original_title = StringField()
    overview = StringField()
    popularity = IntField()
    poster_path = StringField()
    production_companies = ListField()
    production_countries = ListField()
    release_date = StringField()
    revenue = IntField()
    runtime = IntField()
    spoken_languages = ListField()
    status = StringField()
    tagline = StringField()
    title = StringField()
    video = BooleanField()
    vote_average = IntField()
    vote_count = IntField()
    directors = ListField()

class Rating(EmbeddedDocument):
    movie_id = StringField(required=True)
    rating = IntField(required=True)


class User(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_USERS")}
    _id = ObjectIdField()
    email = StringField(unique=True)
    password = StringField()
    ratings = ListField(EmbeddedDocumentField(Rating))
