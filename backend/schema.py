import graphene

from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType

from models import Movie as MovieModel

class Movie(MongoengineObjectType):
    class Meta:
        description = "A movie"
        model = MovieModel
        interfaces = (Node,)

class Query(graphene.ObjectType):
    node = Node.Field()
    
    all_movies = MongoengineConnectionField(Movie)

schema = graphene.Schema(query=Query, types=[Movie])