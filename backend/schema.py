import graphene
import bcrypt
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

class AuthenticateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    success = graphene.Boolean()

    def mutate(root, info, email, password):
        user_model = UserModel.objects(email=email).first()

        if user_model:
            if bcrypt.checkpw(password.encode('utf-8'), user_model.password.encode('utf-8')):
                success = True
            else:
                success = False
        else:
            success = False
        
        return AuthenticateUser(success=success)


class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()

    # Important: Use the "User" class and not the model. For some reason very important.
    user_model = graphene.Field(User)

    def mutate(root, info, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_model = UserModel(email=email, password=hashed_password)
        user_model.save()
        return CreateUser(user_model=user_model)

class Query(graphene.ObjectType):
    node = Node.Field()

    all_users = MongoengineConnectionField(User)
    
    all_movies = MongoengineConnectionField(Movie)

class Mutation(graphene.ObjectType):
    node = Node.Field()
    auth_user = AuthenticateUser.Field()
    user_create = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])