import os
from flask import Flask
from flask_graphql import GraphQLView
from mongoengine import connect
from dotenv import load_dotenv
from schema import schema

load_dotenv()

DATABASE_NAME = os.getenv("MONGO_DB")
CONNECTION_STRING = os.getenv("MONGO_URI")

client = connect(DATABASE_NAME, host=CONNECTION_STRING, alias="default")

app = Flask(__name__)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

if __name__ == '__main__':
    app.run(port=5002)