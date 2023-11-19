import base64
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
    cursor = graphene.String()
    node = graphene.Field(Movie)

    def resolve_cursor(self, info):
        return base64.b64encode(str(self.node._id).encode("utf-8")).decode("utf-8")


class PageInfo(graphene.ObjectType):
    has_next_page = graphene.Boolean()
    has_previous_page = graphene.Boolean()


def get_total_count_of_movies():
    return MovieModel.objects.count()


class MovieConnection(graphene.relay.Connection):
    class Meta:
        node = Movie

    edges = graphene.List(MovieEdge)
    page_info = graphene.Field(PageInfo)

    def resolve_edges(self, info):
        edges = [MovieEdge(node=movie) for movie in self.iterable]
        return edges

    def resolve_page_info(self, info):
        args = info.context["all_movies_args"]
        first = args.get("first", 0)
        last = args.get("last", 0)
        before = args.get("before")
        after = args.get("after")

        last_movie_id = None
        if after is not None:
            last_movie_id = ObjectId(base64.b64decode(after).decode("utf-8"))

        total_count = get_total_count_of_movies()

        has_next_page = False
        if last_movie_id is not None:
            remaining_movies = MovieModel.objects.filter(_id__gt=last_movie_id)
            has_next_page = remaining_movies.count() > first
        else:
            has_next_page = total_count > first

        has_previous_page = False
        if before:
            before_id = ObjectId(base64.b64decode(before).decode("utf-8"))
            # Check if there are any movies before this ID
            has_previous_page = MovieModel.objects(_id__lt=before_id).count() > 0
        elif after:
            # If 'after' is provided but not 'before', check if there are movies before 'after'
            after_id = ObjectId(base64.b64decode(after).decode("utf-8"))
            has_previous_page = MovieModel.objects(_id__lt=after_id).count() > 0

        return PageInfo(
            has_next_page=has_next_page, has_previous_page=has_previous_page
        )


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


class SortEnum(graphene.Enum):
    TITLE_ASC = "title_asc"
    TITLE_DESC = "title_desc"
    RELEASE_DATE_ASC = "release_date_asc"
    RELEASE_DATE_DESC = "release_date_desc"


class Query(graphene.ObjectType):
    node = Node.Field()

    all_users = MongoengineConnectionField(User)

    all_movies = graphene.relay.ConnectionField(
        MovieConnection,
        sort=graphene.String(),
        first=graphene.Int(),
        last=graphene.Int(),
        title=graphene.String(),
        release_date=graphene.String(),
        after=graphene.String(),
        before=graphene.String(),
        start_year=graphene.Int(),
        end_year=graphene.Int(),
    )

    def resolve_all_movies(self, info, **args):
        query = MovieModel.objects.all()

        info.context["all_movies_args"] = args

        sort = args.get("sort")
        title = args.get("title")
        first = args.get("first")
        last = args.get("last")
        before = args.get("before")
        after = args.get("after")
        start_year = args.get("start_year")
        end_year = args.get("end_year")

        if first is not None and last is not None:
            raise Exception("Cannot use 'first' and 'last' together in the same query.")
        if before is not None and after is not None:
            raise Exception(
                "Cannot use 'before' and 'after' together in the same query."
            )

        if sort == "title_asc":
            query = query.order_by("title")
        elif sort == "title_desc":
            query = query.order_by("-title")
        elif sort == "release_date_asc":
            query = query.order_by("release_date")
        elif sort == "release_date_desc":
            query = query.order_by("-release_date")

        if title is not None:
            query = query.filter(title__icontains=title)

        if start_year is not None and end_year is not None:
            start_date = f"{start_year}-01-01"
            end_date = f"{end_year}-12-31"
            query = query.filter(
                release_date__gte=start_date, release_date__lte=end_date
            )

        if after:
            after_id = ObjectId(base64.b64decode(after).decode("utf-8"))
            query = query.filter(_id__gt=after_id)

        if before:
            before_id = ObjectId(base64.b64decode(before).decode("utf-8"))
            query = query.filter(_id__lt=before_id)

        if first is not None:
            query = query.limit(first)
        elif last is not None:
            query = query.order_by("_id").limit(last)

        return query


class Mutation(graphene.ObjectType):
    node = Node.Field()
    auth_user = AuthenticateUser.Field()
    user_create = CreateUser.Field()
    update_user_ratings = UpdateUserRatings.Field()


if __name__ == "__main__":
    id = ObjectId("654b65d6671ff470fcdd7bfe")
    print(base64.b64encode(str(id).encode("utf-8")).decode("utf-8"))

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])
