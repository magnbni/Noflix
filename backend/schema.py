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
    cursor = graphene.String()
    node = graphene.Field(Movie)

    def resolve_cursor(self, info):
        return encode_cursor(self.node)


class PageInfo(graphene.ObjectType):
    has_next_page = graphene.Boolean()
    has_previous_page = graphene.Boolean()


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
        first = args.get("first")
        last = args.get("last")
        before = args.get("before")
        after = args.get("after")
        sort = args.get("sort", None)

        first = int(first) if first is not None else None
        last = int(last) if last is not None else None

        query = MovieModel.objects.all()

        if sort is not None:
            query = sort_query(query, sort)

        has_next_page = has_next(query, first, last, before, after)
        has_previous_page = has_previous(query, first, last, before, after)

        return PageInfo(
            has_next_page=has_next_page, has_previous_page=has_previous_page
        )


def find_cursor_index(query, cursor):
    if not cursor:
        return None
    
    cursor_data = decode_cursor(cursor)
    cursor_id = cursor_data['id']
    cursor_title = cursor_data['title']
    cursor_release_date = cursor_data['release_date']

    for index, item in enumerate(query):
        if str(item._id) == cursor_id and item.title == cursor_title and str(item.release_date) == cursor_release_date:
            return index

    return None


def has_next(query, first, last, before, after):
    if first is not None:
        if after:
            after_index = find_cursor_index(query, after)
            return after_index + first < query.count()
        return first < query.count()
    elif last is not None and before:
        before_index = find_cursor_index(query, before)
        return before_index - last > 0
    return False


def has_previous(query, first, last, before, after):
    if first is not None and after:
        after_index = find_cursor_index(query, after)
        return after_index > 0
    elif last is not None:
        if before:
            before_index = find_cursor_index(query, before)
            return before_index > 0
        return last < query.count()
    return False


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


def get_sort_field_and_order(sort_query):
    if sort_query is None:
        return None, None
    sort_field, sort_order = sort_query.rsplit("_")
    return sort_field, sort_order


def encode_cursor(movie):
    cursor_data = {
        "id": str(movie._id),
        "title": movie.title,
        "release_date": str(movie.release_date),
    }
    json_data = json.dumps(cursor_data)
    return base64.b64encode(json_data.encode("utf-8")).decode("utf-8")


def decode_cursor(cursor):
    json_data = base64.b64decode(cursor).decode("utf-8")
    return json.loads(json_data)


def apply_cursor_to_query(query, cursor, sort_order):
    cursor_data = decode_cursor(cursor)

    if sort_order == "title_asc":
        return query.filter(
            Q(title__gt=cursor_data['title']) |
            (Q(title=cursor_data['title']) & Q(_id__gt=ObjectId(cursor_data['id'])))
        )
    elif sort_order == "title_desc":
        return query.filter(
            Q(title__lt=cursor_data['title']) |
            (Q(title=cursor_data['title']) & Q(_id__lt=ObjectId(cursor_data['id'])))
        )
    elif sort_order == "release_date_asc":
        return query.filter(
            Q(release_date__gt=cursor_data['release_date']) |
            (Q(release_date=cursor_data['release_date']) & Q(_id__gt=ObjectId(cursor_data['id'])))
        )
    elif sort_order == "release_date_desc":
        return query.filter(
            Q(release_date__lt=cursor_data['release_date']) |
            (Q(release_date=cursor_data['release_date']) & Q(_id__lt=ObjectId(cursor_data['id'])))
        )
    else:
        # Default to sorting by _id
        return query.filter(_id__gt=ObjectId(cursor_data['id']))


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

        query = sort_query(query, sort)

        if title is not None:
            query = query.filter(title__icontains=title)

        if start_year is not None and end_year is not None:
            start_date = f"{start_year}-01-01"
            end_date = f"{end_year}-12-31"
            query = query.filter(
                release_date__gte=start_date, release_date__lte=end_date
            )

        if after:
            # after_id = ObjectId(base64.b64decode(after).decode("utf-8"))
            # query = query.filter(_id__gt=after_id)
            query = apply_cursor_to_query(query, after, sort)

        if before:
            # before_id = ObjectId(base64.b64decode(before).decode("utf-8"))
            # query = query.filter(_id__lt=before_id)
            query = apply_cursor_to_query(query, before, sort)

        if first is not None:
            query = query.limit(first)
        elif last is not None:
            total = query.count()
            offset = max(0, total - last)
            query = query.order_by("_id")[offset:]

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
