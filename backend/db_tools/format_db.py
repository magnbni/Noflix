import os
import random
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
db = os.getenv("MONGO_DB")
collection_movies = os.getenv("MONGO_COLLECTION_MOVIES")

# Connect to the MongoDB server
client = MongoClient(os.getenv("MONGO_URI"))

# Select the database and collection
db = client[os.getenv("MONGO_DB")]

# Select the collection to query
collection_movies = db[os.getenv("MONGO_COLLECTION_MOVIES")]

def duplicate_collection():
    # Create a new collection
    db[os.getenv("MONGO_COLLECTION_MOVIES") + "_copy"].insert_many(collection_movies.find())

def remove_n_documents(n: int):
    # list_of_ids=list(collection_movies.aggregate([{'$sample': {'size': n }}, {'$project' : {'tconst' : 1}}]))
    # collection_movies.delete_many({'tconst': {'$in': list_of_ids}})
    total_docs = len(list(collection_movies.find({})))
    if n > total_docs:
        print(f"There are only {total_docs} documents, can't delete {n} documents.")
        n = total_docs  # or set n to a smaller number or exit
    all_ids = [doc['_id'] for doc in collection_movies.find({}, {'_id': 1})]
    ids_to_delete = random.sample(all_ids, n)
    result = collection_movies.delete_many({'_id': {'$in': ids_to_delete}})



if __name__ == "__main__":
    remove_n_documents(853999)
