from pymongo import MongoClient
import datetime
import matplotlib.pyplot as plt
import numpy as np

# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.policy_cases
policy_collection = db.policy_cases

POLICY_KEY = "C4_Restrictions_on_gatherings"


aggregate_pipeline_max = [
    {"$group": {
        "_id": {"Date":"$Date"},
        "metric_test": {"$max": "${}".format(POLICY_KEY)},
        }
    },
    {"$sort": {"_id.Date":1}},
    ]

aggregate_pipeline_avg = [
    {"$group": {
        "_id": {"Date":"$Date"},
        "metric_test": {"$avg": "${}".format(POLICY_KEY)},
        }
    },
    {"$sort": {"_id.Date":1}},
    ]

def decompose_aggregare_obj(aggregate_obj, type='max'):
    dates = []
    metric_test_scores = []
    n_states = []
    states = []
    for object_ in aggregate_obj:
        testing_policy = {
            'max': object_["metric_test"],
            'avg': {"$gt": object_["metric_test"]}
        }
        states_obj = list(
            policy_collection.aggregate([
                {"$match": {"Date": object_["_id"]["Date"], "{}".format(POLICY_KEY): testing_policy[type],
                            "RegionName": {"$ne": "Federal"}}},
                {"$project": {"RegionCode": 1}},
            ])
        )
        dates.append(object_["_id"]["Date"].strftime("%y-%m-%d"))
        metric_test_scores.append(object_["metric_test"])
        n_states.append(len(states_obj))
        states.append(extract_states(states_obj))

        print(object_["_id"]["Date"].strftime("%d/%m/%y"), len(extract_states(states_obj)), object_["metric_test"])
    return dates, metric_test_scores, n_states, states

def extract_states(states_obj):
    states_of_day = []
    for obj_ in states_obj:
        states_of_day.append(obj_["RegionCode"])
    return states_of_day

def plot_general_trend(dates, high_scores, high_n_states, avg_scores, avg_n_states):
    legend_label = ["highest score","avg score"]
    legend_operator = ["=", ">"]

    high_n_states = np.asarray(high_n_states) / 52
    high_scores = np.asarray(high_scores) / 4
    avg_n_states = np.asarray(avg_n_states) / 52
    avg_scores = np.asarray(avg_scores) / 4

    fig, ax = plt.subplots(1, 2)
    ax[0].plot(dates, high_scores, label="score")
    ax[0].plot(dates, high_n_states, label="% of states with scores {} {}".format(legend_operator[0], legend_label[0]))

    ax[1].plot(dates, avg_scores, label="score")
    ax[1].plot(dates, avg_n_states, label="% of states with scores {} {}".format(legend_operator[1], legend_label[1]))

    ax[0].title.set_text('Highest scores')
    ax[1].title.set_text('Avg scores')

    print(np.arange(dates[0], dates[len(dates)-1], np.timedelta64(1,'m'), dtype='datetime64'))
    ax[0].set_xticks([dates[0], dates[int(len(dates)/2)], dates[-1]])
    ax[1].set_xticks([dates[0], dates[int(len(dates) / 2)], dates[-1]])
    ax[0].legend(loc="upper left", prop={'size': 10})
    ax[1].legend(loc="upper left", prop={'size': 10})
    plt.show()

def get_general_trend():
    aggregate_object_max = list(policy_collection.aggregate(aggregate_pipeline_max))
    aggregate_obj_avg = list(policy_collection.aggregate(aggregate_pipeline_avg))
    # max metric:
    dates, highest_test_scores, n_states_highest, states_highest = decompose_aggregare_obj(aggregate_object_max, 'max')

    # avg metric:
    _, avg_test_scores, n_states_avg, states_avg = decompose_aggregare_obj(aggregate_obj_avg, 'avg')
    plot_general_trend(dates, highest_test_scores, n_states_highest, avg_test_scores, n_states_avg)

if __name__ == "__main__":
    get_general_trend()

    # find best performing state by average in last 1 month
    last_date = datetime.datetime(2020, 5, 30, 0, 0)
    one_month_before_last = last_date + datetime.timedelta(days=-30)
    two_months_before_last = last_date + datetime.timedelta(days=-60)
    three_mt_before_last = last_date + datetime.timedelta(days=-90)
    aggregate_pipeline_2 = [
        {"$match": { "$and": [ {"Date": {"$gte": two_months_before_last, "$lte": last_date }}]}},
        {"$group": {
            '_id': {"RegionName":"$RegionName"},
            "avg": {"$avg": "${}".format(POLICY_KEY)}
        }},
        {"$sort": {"avg":1}},
        {"$limit": 6},
    ]
    states = []
    for obj_ in policy_collection.aggregate(aggregate_pipeline_2):
        states.append(obj_["_id"]["RegionName"])
    print(states)
    print(list(policy_collection.aggregate(aggregate_pipeline_2)))
