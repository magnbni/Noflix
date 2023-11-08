import os
from flask import Flask
from graphql_server.flask import GraphQLView
from mongoengine import connect
from dotenv import load_dotenv
from schema import schema
from flask_cors import CORS

load_dotenv()

DATABASE_NAME = os.getenv("MONGO_DB")
CONNECTION_STRING = os.getenv("MONGO_URI")

client = connect(DATABASE_NAME, host=CONNECTION_STRING, alias="default")

app = Flask(__name__)
CORS(app)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

if __name__ == '__main__':
    app.run(port=4000)