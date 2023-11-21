import os
from dotenv import load_dotenv
from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import StringField, IntField, ListField, BooleanField, FloatField
from mongoengine.fields import ReferenceField, EmbeddedDocumentField, ObjectIdField, EmbeddedDocumentListField

load_dotenv()

class Genre(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_GENRES")}
    _id = StringField()
    id = IntField()
    name = StringField()

class EmbeddedGenre(EmbeddedDocument):
    id = IntField()
    name = StringField()

class Director(EmbeddedDocument):
    adult = BooleanField()
    gender = IntField()
    id = IntField()
    known_for_department = StringField()
    name = StringField()
    original_name = StringField()
    popularity = FloatField()
    department = StringField()
    job = StringField()
    profile_path = StringField()
    credit_id = StringField()

class Movie(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_MOVIES")}
    _id = StringField()
    adult = BooleanField()
    backdrop_path = StringField()
    belongs_to_collection = StringField()
    budget = IntField()
    genres = EmbeddedDocumentListField(EmbeddedGenre)
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
    directors = EmbeddedDocumentListField(Director)

class Rating(EmbeddedDocument):
    # Make into StringField again
    movie_id = StringField(required=True)
    rating_value = IntField(required=True)

class User(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_USERS")}
    _id = StringField()
    email = StringField(unique=True)
    password = StringField()
    ratings = EmbeddedDocumentListField(Rating)
