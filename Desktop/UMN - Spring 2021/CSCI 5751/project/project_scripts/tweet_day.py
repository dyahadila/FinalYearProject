# Which day has the highest number of COVID-19 tweets in the US?

from pymongo import MongoClient
import datetime
import matplotlib.pyplot as plt
import numpy as np

# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.Cleansed_Tweets
tweet_collection = db.tweets

aggregate_pipeline = [
    {"$project" : { "day" : {"$substr": ["$created_at", 0, 10] }}},
    {"$group": {
        "_id": "$day",
        "tweet_count": {"$sum": 1},
        }
    },
    {"$sort": {"tweet_count":1}},
    ]

aggregate_pipeline_2 = [
    {"$project" : { "date" : {"$substr": ["$created_at", 0, 10] }}},
    {"$project": {
          "date": {
             "$dateFromString": {
                "dateString": "$date",
             }
          }
       }},
    {"$group": {"_id": "$date",
                "tweet_count": {"$sum": 1},
                }},
    {"$sort": {"_id":1}},
]

# print(list(tweet_collection.aggregate(aggregate_pipeline_2)))
date_tweet = [{'_id': datetime.datetime(2020, 2, 1, 0, 0), 'tweet_count': 44855}, {'_id': datetime.datetime(2020, 2, 2, 0, 0), 'tweet_count': 62009}, {'_id': datetime.datetime(2020, 2, 3, 0, 0), 'tweet_count': 60465}, {'_id': datetime.datetime(2020, 2, 4, 0, 0), 'tweet_count': 54674}, {'_id': datetime.datetime(2020, 2, 5, 0, 0), 'tweet_count': 51637}, {'_id': datetime.datetime(2020, 2, 6, 0, 0), 'tweet_count': 59698}, {'_id': datetime.datetime(2020, 2, 7, 0, 0), 'tweet_count': 72774}, {'_id': datetime.datetime(2020, 2, 8, 0, 0), 'tweet_count': 66239}, {'_id': datetime.datetime(2020, 2, 9, 0, 0), 'tweet_count': 49704}, {'_id': datetime.datetime(2020, 2, 10, 0, 0), 'tweet_count': 58469}, {'_id': datetime.datetime(2020, 2, 11, 0, 0), 'tweet_count': 63253}, {'_id': datetime.datetime(2020, 2, 12, 0, 0), 'tweet_count': 47546}, {'_id': datetime.datetime(2020, 2, 13, 0, 0), 'tweet_count': 58911}, {'_id': datetime.datetime(2020, 2, 14, 0, 0), 'tweet_count': 49215}, {'_id': datetime.datetime(2020, 2, 15, 0, 0), 'tweet_count': 35636}, {'_id': datetime.datetime(2020, 2, 16, 0, 0), 'tweet_count': 41648}, {'_id': datetime.datetime(2020, 2, 17, 0, 0), 'tweet_count': 43116}, {'_id': datetime.datetime(2020, 2, 18, 0, 0), 'tweet_count': 41140}, {'_id': datetime.datetime(2020, 2, 19, 0, 0), 'tweet_count': 36966}, {'_id': datetime.datetime(2020, 2, 20, 0, 0), 'tweet_count': 35474}, {'_id': datetime.datetime(2020, 2, 21, 0, 0), 'tweet_count': 50640}, {'_id': datetime.datetime(2020, 2, 22, 0, 0), 'tweet_count': 49195}, {'_id': datetime.datetime(2020, 2, 23, 0, 0), 'tweet_count': 55567}, {'_id': datetime.datetime(2020, 2, 24, 0, 0), 'tweet_count': 124888}, {'_id': datetime.datetime(2020, 2, 25, 0, 0), 'tweet_count': 241746}, {'_id': datetime.datetime(2020, 2, 26, 0, 0), 'tweet_count': 291101}, {'_id': datetime.datetime(2020, 2, 27, 0, 0), 'tweet_count': 477156}, {'_id': datetime.datetime(2020, 2, 28, 0, 0), 'tweet_count': 467462}, {'_id': datetime.datetime(2020, 2, 29, 0, 0), 'tweet_count': 461502}, {'_id': datetime.datetime(2020, 3, 1, 0, 0), 'tweet_count': 349911}, {'_id': datetime.datetime(2020, 3, 2, 0, 0), 'tweet_count': 403020}, {'_id': datetime.datetime(2020, 3, 3, 0, 0), 'tweet_count': 390131}, {'_id': datetime.datetime(2020, 3, 4, 0, 0), 'tweet_count': 403476}, {'_id': datetime.datetime(2020, 3, 5, 0, 0), 'tweet_count': 525901}, {'_id': datetime.datetime(2020, 3, 6, 0, 0), 'tweet_count': 547286}, {'_id': datetime.datetime(2020, 3, 7, 0, 0), 'tweet_count': 473176}, {'_id': datetime.datetime(2020, 3, 8, 0, 0), 'tweet_count': 478973}, {'_id': datetime.datetime(2020, 3, 9, 0, 0), 'tweet_count': 618099}, {'_id': datetime.datetime(2020, 3, 10, 0, 0), 'tweet_count': 591686}, {'_id': datetime.datetime(2020, 3, 11, 0, 0), 'tweet_count': 649734}, {'_id': datetime.datetime(2020, 3, 12, 0, 0), 'tweet_count': 889614}, {'_id': datetime.datetime(2020, 3, 13, 0, 0), 'tweet_count': 877555}, {'_id': datetime.datetime(2020, 3, 14, 0, 0), 'tweet_count': 681015}, {'_id': datetime.datetime(2020, 3, 15, 0, 0), 'tweet_count': 754557}, {'_id': datetime.datetime(2020, 3, 16, 0, 0), 'tweet_count': 783338}, {'_id': datetime.datetime(2020, 3, 17, 0, 0), 'tweet_count': 862102}, {'_id': datetime.datetime(2020, 3, 18, 0, 0), 'tweet_count': 467112}, {'_id': datetime.datetime(2020, 3, 19, 0, 0), 'tweet_count': 343022}, {'_id': datetime.datetime(2020, 3, 20, 0, 0), 'tweet_count': 334204}, {'_id': datetime.datetime(2020, 3, 21, 0, 0), 'tweet_count': 305484}, {'_id': datetime.datetime(2020, 3, 22, 0, 0), 'tweet_count': 486689}, {'_id': datetime.datetime(2020, 3, 23, 0, 0), 'tweet_count': 727493}, {'_id': datetime.datetime(2020, 3, 24, 0, 0), 'tweet_count': 645481}, {'_id': datetime.datetime(2020, 3, 25, 0, 0), 'tweet_count': 519985}, {'_id': datetime.datetime(2020, 3, 26, 0, 0), 'tweet_count': 776983}, {'_id': datetime.datetime(2020, 3, 27, 0, 0), 'tweet_count': 726237}, {'_id': datetime.datetime(2020, 3, 28, 0, 0), 'tweet_count': 683268}, {'_id': datetime.datetime(2020, 3, 29, 0, 0), 'tweet_count': 771984}, {'_id': datetime.datetime(2020, 3, 30, 0, 0), 'tweet_count': 848245}, {'_id': datetime.datetime(2020, 3, 31, 0, 0), 'tweet_count': 833501}, {'_id': datetime.datetime(2020, 4, 1, 0, 0), 'tweet_count': 846043}, {'_id': datetime.datetime(2020, 4, 2, 0, 0), 'tweet_count': 863392}, {'_id': datetime.datetime(2020, 4, 3, 0, 0), 'tweet_count': 103052}]
tweet_count = []
dates = []
for obj_ in date_tweet:
    tweet_count.append(obj_["tweet_count"])
    dates.append(obj_["_id"])

plt.plot(dates, tweet_count)
plt.xticks([dates[0], dates[int(len(dates)/2)], dates[-1]])
plt.title("Tweet count per day")
plt.show()

