import os
from flask import Flask, request
from graphql_server.flask import GraphQLView
from mongoengine import connect
from dotenv import load_dotenv
from schema import schema
from flask_cors import CORS
from collections import UserDict

load_dotenv()

DATABASE_NAME = os.getenv("MONGO_DB")
CONNECTION_STRING = os.getenv("MONGO_URI")

client = connect(DATABASE_NAME, host=CONNECTION_STRING, alias="default")

app = Flask(__name__)
CORS(app)

class DebugGraphQLView(GraphQLView):
    def dispatch_request(self):
        # print(request.get_data())  # Print the received query
        return super().dispatch_request()

app.add_url_rule('/graphql', view_func=DebugGraphQLView.as_view('graphql', schema=schema, graphiql=True, context=UserDict()))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)