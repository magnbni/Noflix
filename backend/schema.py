import base64
import graphene
import bcrypt
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from bson import ObjectId
from models import Movie as MovieModel
from models import User as UserModel


class Movie(MongoengineObjectType):
    class Meta:
        name = "Movie"
        description = "A movie"
        model = MovieModel
        interfaces = (Node,)
        filter_fields = {
            "title": ["exact", "iexact", "contains", "icontains"],  # Add regex options
            "release_date": ["exact", "icontains", "istartswith"],
        }
        ordering = "title"

class MovieEdge(graphene.ObjectType):
    cursor = graphene.String()
    node = graphene.Field(Movie)

    def resolve_cursor(self, info):
        return base64.b64encode(str(self.node._id).encode('utf-8')).decode('utf-8')

class MovieConnection(graphene.relay.Connection):
    class Meta:
        node = Movie

    edges = graphene.List(MovieEdge)

    def resolve_edges(self, info):
        edges = [MovieEdge(node=movie) for movie in self.iterable]
        return edges

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
        sort=SortEnum(),
        first=graphene.Int(),
        title=graphene.String(),
        release_date=graphene.String(),
        cursor=graphene.String(),
    )

    def resolve_all_movies(
        self, info, sort=None, first=None, title=None, release_date=None, after=None, offset=None
    ):
        query = MovieModel.objects.all()

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

        if release_date is not None:
            query = query.filter(release_date__icontains=release_date)

        if offset is not None:
            query_skip = query[offset:]
            if first is not None:
                query_skip = query_skip[offset : first + offset]
                return query_skip
        
        if after is not None:
            after = base64.b64decode(after).decode('utf-8')
            query = query.filter(_id__gt=ObjectId(after))
        if first is not None:
            query = query[:first]
        return query


class Mutation(graphene.ObjectType):
    node = Node.Field()
    auth_user = AuthenticateUser.Field()
    user_create = CreateUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])
