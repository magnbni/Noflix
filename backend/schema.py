import graphene
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from models import Movie as MovieModel
from models import User as UserModel

class Movie(MongoengineObjectType):
    class Meta:
        name = "Movie"
        description = "A movie"
        model = MovieModel
        interfaces = (Node,)

class User(MongoengineObjectType):
    class Meta:
        name = "User"
        description = "A user"
        model = UserModel
        interfaces = (Node,)

class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    # Important: Use the "User" class and not the model. For some reason very important.
    user_model = graphene.Field(User)

    def mutate(root, info, email, password):
        user_model = UserModel(email=email, password=password)
        user_model.save()
        return CreateUser(user_model=user_model)

class Query(graphene.ObjectType):
    node = Node.Field()

    all_users = MongoengineConnectionField(User)
    
    all_movies = MongoengineConnectionField(Movie)

class Mutation(graphene.ObjectType):
    node = Node.Field()
    user_create = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])