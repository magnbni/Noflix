import base64
import json
import graphene
import bcrypt
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from bson import ObjectId
from models import Movie as MovieModel
from models import User as UserModel
from models import Rating as RatingModel
from models import Director as DirectorModel
from models import Genre as GenreModel
from mongoengine import Q


# Need to define the embeddeddocuments so graphene recognizes them
class GenreType(MongoengineObjectType):
    class Meta:
        model = GenreModel


class DirectorType(MongoengineObjectType):
    class Meta:
        model = DirectorModel


class Movie(MongoengineObjectType):
    class Meta:
        name = "Movie"
        description = "A movie"
        model = MovieModel
        interfaces = (Node,)
        filter_fields = {
            "title": ["exact", "iexact", "contains", "icontains"],
            "release_date": ["exact", "icontains", "istartswith"],
        }
        ordering = "title"


class MovieEdge(graphene.ObjectType):
    node = graphene.Field(Movie)


class PageInfo(graphene.ObjectType):
    has_next_page = graphene.Boolean()
    has_previous_page = graphene.Boolean()
    total_pages = graphene.Int()


class MovieConnection(graphene.relay.Connection):
    class Meta:
        node = Movie

    edges = graphene.List(MovieEdge)
    page_info = graphene.Field(PageInfo)
    total_pages = graphene.Int()

    def resolve_edges(self, info):
        edges = [MovieEdge(node=movie) for movie in self.iterable]
        return edges

    def resolve_page_info(self, info):
        args = info.context["all_movies_args"]
        has_next_page = args["has_next_page"]
        has_previous_page = args["has_previous_page"]

        return PageInfo(
            has_next_page=has_next_page,
            has_previous_page=has_previous_page,
        )

    def resolve_total_pages(self, info):
        args = info.context["all_movies_args"]
        total_pages = args["total_pages"]
        return total_pages


class Rating(MongoengineObjectType):
    class Meta:
        name = "Rating"
        description = "List of ratings for a user"
        model = RatingModel
        interfaces = (Node,)


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
            if bcrypt.checkpw(
                password.encode("utf-8"), user_model.password.encode("utf-8")
            ):
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
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user_model = UserModel(email=email, password=hashed_password)
        user_model.save()
        return CreateUser(user_model=user_model)


class RatingInput(graphene.InputObjectType):
    movie_id = graphene.String(required=True)
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
                movie_id = rating_input["movie_id"]

                rating_value = rating_input["rating_value"]

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


def sort_query(query, sort):
    if sort == "title_asc":
        return query.order_by("title", "_id")
    elif sort == "title_desc":
        return query.order_by("-title", "_id")
    elif sort == "release_date_asc":
        return query.order_by("release_date", "_id")
    elif sort == "release_date_desc":
        return query.order_by("-release_date", "_id")
    else:
        # Default sort by _id
        return query.order_by("_id")


class Query(graphene.ObjectType):
    node = Node.Field()

    all_users = MongoengineConnectionField(User)

    all_movies = graphene.relay.ConnectionField(
        MovieConnection,
        page=graphene.Int(default_value=1),
        per_page=graphene.Int(default_value=10),
        sort=graphene.String(),
        start_year=graphene.Int(),
        end_year=graphene.Int(),
        title=graphene.String(),
    )

    def resolve_all_movies(
        self,
        info,
        page,
        per_page,
        sort=None,
        start_year=None,
        end_year=None,
        title=None,
    ):
        # Calculate offset
        offset = (page - 1) * per_page

        # Start with the base query
        query = MovieModel.objects.all()
        # Apply title-based filtering

        if title:
            query = query.filter(title__icontains=title)

        # Apply year-based filtering
        if start_year and end_year:
            query = query.filter(
                release_date__gte=f"{start_year}-01-01",
                release_date__lte=f"{end_year}-12-31",
            )

        # Apply sorting
        if sort:
            query = sort_query(query, sort)

        # Fetch total count before applying limit and offset
        total_count = query.count()

        # Apply limit and offset for pagination
        query = query.skip(offset).limit(per_page)

        # Determine hasNextPage and hasPreviousPage
        has_next_page = offset + per_page < total_count
        has_previous_page = page > 1
        total_pages = (total_count + per_page - 1) // per_page

        # Store the arguments in the context for later use
        info.context["all_movies_args"] = {
            "has_next_page": has_next_page,
            "has_previous_page": has_previous_page,
            "total_pages": total_pages,
        }

        return query


class Mutation(graphene.ObjectType):
    node = Node.Field()
    auth_user = AuthenticateUser.Field()
    user_create = CreateUser.Field()
    update_user_ratings = UpdateUserRatings.Field()


# For debugging purposes
if __name__ == "__main__":
    id = ObjectId("654b65d6671ff470fcdd7bfe")
    print(base64.b64encode(str(id).encode("utf-8")).decode("utf-8"))
    encoded_id = "NjU0YjY1YWY2NzFmZjQ3MGZjZGQyYjY3"
    print(base64.b64decode(encoded_id).decode("utf-8"))

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])
