#How do the states rank in terms of average Twitter sentiment about COVID-19?

from pymongo import MongoClient

# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.aggregate_data
collection = db["aggregated_dataset"]

aggregate_pipeline = [
    {"$project" : {
        "sentiment": "$tweet_metrics.avg_sentiment",
        "state_date": {"$split": ["$_id", "_"]},
    }},
    {"$project": {
        "state": {"$arrayElemAt": ["$state_date", 0]},
        "sentiment": "$sentiment",
    }},
    {"$group": {
        "_id": "$state",
        "avg_sentiment": {"$avg": "$sentiment"}
    }},
    {"$sort": {"avg_sentiment": 1}}
]

print(list(collection.aggregate(aggregate_pipeline)))