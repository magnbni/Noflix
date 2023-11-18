import base64
import math
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
            "title": ["exact", "iexact", "contains", "icontains"],
            "release_date": ["exact", "icontains", "istartswith"],
        }
        ordering = "title"

class MovieEdge(graphene.ObjectType):
    cursor = graphene.String()
    node = graphene.Field(Movie)

    def resolve_cursor(self, info):
        return base64.b64encode(str(self.node._id).encode('utf-8')).decode('utf-8')

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
        args = info.context['all_movies_args']
        print(args)
        first = args.get('first', 0)
        after = args.get('after')

        start = 0
        last_movie_id = None
        if after is not None:
            last_movie_id = ObjectId(base64.b64decode(after).decode('utf-8'))

        total_count = get_total_count_of_movies()

        has_next_page = False
        if last_movie_id is not None:
            remaining_movies = MovieModel.objects.filter(_id__gt=last_movie_id)
            has_next_page = remaining_movies.count() > first
        else:
            has_next_page = total_count > first
        
        has_previous_page = last_movie_id is not None

        return PageInfo(has_next_page=has_next_page, has_previous_page=has_previous_page)

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
        self, info, **args
    ):
        query = MovieModel.objects.all()
        
        info.context['all_movies_args'] = args

        sort= args.get('sort')
        title = args.get('title')
        release_date = args.get('release_date')
        offset = args.get('offset')
        first = args.get('first')
        after = args.get('after')

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

if __name__ == "__main__":
    id = ObjectId("654b65d6671ff470fcdd7bfe")
    print(base64.b64encode(str(id).encode('utf-8')).decode('utf-8'))

schema = graphene.Schema(query=Query, mutation=Mutation, types=[Movie, User])
