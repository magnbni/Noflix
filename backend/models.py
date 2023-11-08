import os
from dotenv import load_dotenv
from mongoengine import Document
from mongoengine.fields import StringField, IntField, ListField, BooleanField

load_dotenv()

class Movie(Document):
    meta = {"collection": os.getenv("MONGO_COLLECTION_MOVIES")}
    _id = StringField()
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