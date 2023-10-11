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

def chunks(array, n):
    # Yield successive n-sized chunks from array
    for i in range(0, len(array), n):
        yield array[i:i + n]

def duplicate_collection():
    # Create a new collection
    db[os.getenv("MONGO_COLLECTION_MOVIES") + "_copy"].insert_many(collection_movies.find())

def remove_n_documents(n: int):
    # Remove n random documents from the collection
    total_docs = len(list(collection_movies.find({})))
    if n > total_docs:
        print(f"There are only {total_docs} documents, can't delete {n} documents.")
        n = total_docs  # or set n to a smaller number or exit
    all_ids = [doc['_id'] for doc in collection_movies.find({}, {'_id': 1})]
    ids_to_delete = random.sample(all_ids, n)
    split_ids_to_delete = list(chunks(ids_to_delete, 10000))
    for ids in split_ids_to_delete:
        collection_movies.delete_many({'_id': {'$in': ids}})

def convert_non_numerical_fields_to_none():
    # Convert non-numerical fields to None
    collection_movies.update_many({},[{'$set': { 'startYear': { '$convert': { 'input': "$startYear", 'to': "int", "onError": None }}}}])
    collection_movies.update_many({},[{'$set': { 'endYear': { '$convert': { 'input': "$endYear", 'to': "int", "onError": None }}}}])
    collection_movies.update_many({},[{'$set': { 'runtimeMinutes': { '$convert': { 'input': "$runtimeMinutes", 'to': "int", "onError": None }}}}])

def convert_genre_strings_to_array():
    collection_movies.update_many({}, [{"$set": {"genres": {"$split": ["$genres", ","]}}}
    ])

def main():
    convert_non_numerical_fields_to_none()
    # convert_genre_strings_to_array()

if __name__ == "__main__":
    main()
