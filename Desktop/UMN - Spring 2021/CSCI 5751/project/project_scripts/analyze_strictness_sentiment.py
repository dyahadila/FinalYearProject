from pymongo import MongoClient
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
# Do stricter government restrictions lead to higher/lower twitter sentiment for that area?
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.aggregate_data
collection = db["aggregated_dataset"]

POLICY_KEY = "C6_Stay_at_home_requirements"

def get_correlation(score, sentiment):
    index_score_change = np.where(score[:-1] != score[1:])[0]
    if len(index_score_change) > 0:
        idx = index_score_change[0]
        score_slice = score[idx:idx + 7]
        sentiment_slice = sentiment[idx:idx + 7]
        pearson = stats.pearsonr(score_slice, sentiment_slice)
        return pearson[0]
    return -2

def time_series_analysis(dict_):
    relationship_dict = {}
    for i, (k, v) in enumerate(dict_.items()):
        sentiment = np.asarray(v[1])
        score = np.asarray(v[2]).astype(np.float)

        sentiment_norm = (sentiment - np.amin(sentiment)) / (np.amax(sentiment) - np.amin(sentiment))
        score_norm = (score - np.amin(score)) / (np.amax(score) - np.amin(score) + 1e-4)

        corr = get_correlation(score_norm, sentiment_norm)
        relationship_dict[k] = corr
    return sorted(relationship_dict.items(), key=lambda x: x[1])

def get_state_dict(aggregate_obj):
    dict_ = {}
    for obj_ in aggregate_obj:
        state = obj_["_id"].split("_")[0]
        date = obj_["_id"].split("_")[1]

        if state not in dict_:
            dict_[state] = [[date], [obj_["info"][0]["sentiment"]], [obj_["info"][0][POLICY_KEY]]]
        else:
            dict_[state][0].append(date)
            dict_[state][1].append(obj_["info"][0]["sentiment"])
            dict_[state][2].append(obj_["info"][0][POLICY_KEY])
    return dict_

def plot_time_series(dict_):
    fig, ax = plt.subplots(10, 5)
    row_count = 0
    col_count = 0

    for i, (k, v) in enumerate(dict_.items()):
        sentiment = np.asarray(v[1])
        score = np.asarray(v[2]).astype(np.float)

        sentiment_norm = (sentiment - np.amin(sentiment)) / (np.amax(sentiment) - np.amin(sentiment))
        score_norm = (score - np.amin(score)) / (np.amax(score) - np.amin(score) + 1e-4)

        ax[row_count][col_count].plot(v[0], sentiment_norm)
        ax[row_count][col_count].plot(v[0], score_norm)
        ax[row_count][col_count].set_xticks([])
        ax[row_count][col_count].set_title(k, fontsize=8)

        if col_count < 4:
            col_count += 1
        else:
            row_count+=1
            col_count = 0
    fig.subplots_adjust(vspace=2)
    fig.tight_layout(pad=0.0001)
    plt.show()


if __name__ == "__main__":
    aggregate_pipeline = [
        {"$group": {
            "_id": "$_id",
            "info": {'$push': {"sentiment": "$tweet_metrics.avg_sentiment",
                               "{}".format(POLICY_KEY): "${}".format(POLICY_KEY)}},
        }},
        {"$sort": {"_id": 1}}
    ]

    aggregate_obj = list(collection.aggregate(aggregate_pipeline))
    dict_ = get_state_dict(aggregate_obj)
    # plot_time_series(dict_)
    relationship_dict = time_series_analysis(dict_)
    print(relationship_dict)

