from pymongo import MongoClient

# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.Cleansed_Tweets
tweet_collection = db.tweets

#How do the states rank in terms of number of COVID-19 tweets?

aggregate_pipeline = [
    {"$group": {
        "_id": {"geo_state":"$geo.state"},
        "tweet_count": {"$sum": 1},
        }
    },
    {"$sort": {"tweet_count":1}},
    ]

print(list(tweet_collection.aggregate(aggregate_pipeline)))