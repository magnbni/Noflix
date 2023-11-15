import graphene
import bcrypt
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from mongoengine.queryset.visitor import Q
from models import Movie as MovieModel
from models import User as UserModel
from models import Rating as RatingModel

class Movie(MongoengineObjectType):
    class Meta:
        name = "Movie"
        description = "A movie"
        model = MovieModel
        interfaces = (Node,)
        filter_fields = {
            'title': ['exact', 'iexact', 'contains', 'icontains'],  # Add regex options
            'release_date': ['exact', 'icontains', 'istartswith'],
        }
        ordering = 'title'

class Rating(MongoengineObjectType):
    class Meta:
        name = "Rating"
        description = "List of ratings for a user"
        model = RatingModel
        interfaces = (Node,)

class User(MongoengineObjectType):
    class Meta:
        name = "User"
        description = "A user"
        model = UserModel
        interfaces = (Node,)
    
    ratings = graphene.List(Rating)

class AuthenticateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

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

class RatingInput(graphene.InputObjectType):
    movie_id = graphene.ID(required=True)
    rating_value = graphene.Int(required=True)

class UpdateUserRatings(graphene.Mutation):
    class Arguments:
        user_email = graphene.String(required=True)
        ratings = graphene.List(RatingInput, required=True)

    success = graphene.Boolean()

    def mutate(self, info, user_email, ratings):
        try:
            # Get the user by _ids
            user = UserModel.objects.get(email=user_email)

            # Create Rating objects and add to user's ratings list
            for rating_input in ratings:
                movie_id = rating_input['movie_id']
            
                rating_value = rating_input['rating_value']

                # Create a new Rating
                rating = RatingModel(movie_id=movie_id, rating=rating_value)

                # Add the rating to the user's ratings list
                # user.ratings.append(rating)

            # Save the updated user
            user.save()

            success = True
        except Exception as e:
            # Print error if something goes wrong
            print(f"Error updating user ratings: {e}")
            success = False

        return UpdateUserRatings(success=success)

class SortEnum(graphene.Enum):
    TITLE_ASC = 'title_asc'
    TITLE_DESC = 'title_desc'
    RELEASE_DATE_ASC = 'release_date_asc'
    RELEASE_DATE_DESC = 'release_date_desc'

class Query(graphene.ObjectType):
    node = Node.Field()

    all_users = MongoengineConnectionField(User)
    
    all_movies = graphene.List(Movie, _id=graphene.String(), sort=SortEnum(), first=graphene.Int(), skip=graphene.Int(), title=graphene.String(), release_date=graphene.String())

    def resolve_all_movies(self, info, _id=None, sort=None, first=None, skip=None, title=None, release_date=None):
        if _id is not None:
            return MovieModel.objects(_id=_id)

        query = MovieModel.objects.all()
        if sort == 'title_asc':
            query = query.order_by('title')
        elif sort == 'title_desc':
            query = query.order_by('-title')
        elif sort == 'release_date_asc':
            query = query.order_by('release_date')
        elif sort == 'release_date_desc':
            query = query.order_by('-release_date')
        
        if title is not None:
            query = query.filter(title__icontains=title)

        if release_date is not None:
            query = query.filter(release_date__icontains=release_date)

        if skip is not None:
            query = query[skip:]

        if first is not None:
            query = query[:first]

        return query
    
    

class Mutation(graphene.ObjectType):
    node = Node.Field()
    auth_user = AuthenticateUser.Field()
    user_create = CreateUser.Field()
    update_user_ratings = UpdateUserRatings.Field()

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User, Rating])