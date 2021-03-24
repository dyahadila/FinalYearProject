from pymongo import MongoClient
import datetime
import pandas as pd

# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://csel-xsme-s21-csci5751-01.cselabs.umn.edu:27017")
db=client.policy_cases
policy_collection = db.policy_cases

df_count = pd.read_csv("../project_data/population_count.csv")
population_count = {}
for _,row in df_count.iterrows():
    if row["RegionName"] == "District of Columbia":
        population_count["Washington DC"] = row["count"] * 1e6
    else:
        population_count[row["RegionName"]]= row["count"]*1e6

last_date = datetime.datetime(2020, 5, 30, 0, 0)
one_month_before_last = last_date + datetime.timedelta(days=-30)
two_months_before_last = last_date + datetime.timedelta(days=-60)
three_mt_before_last = last_date + datetime.timedelta(days=-90)
aggregate_pipeline_2 = [
    {"$match": {"$and": [{"Date": {"$gte": three_mt_before_last, "$lte": last_date}}, {"RegionName": {"$ne": "Federal"}}]}},
    {"$group": {
        '_id': {"RegionName": "$RegionName"},
        "avg": {"$avg": "$ConfirmedCases"}
    }},
]

average_case = list(policy_collection.aggregate(aggregate_pipeline_2))
cases_obj = {}
for obj_ in average_case:
    cases_obj[obj_["_id"]["RegionName"]]= obj_["avg"]

regionnames = []
normalized_cases_num = []
for k,v in cases_obj.items():
    regionnames.append(k)
    normalized_cases_num.append(v/population_count[k])

normalized_cases = {"RegionName": regionnames, "norm_count": normalized_cases_num}
normalized_cases = pd.DataFrame(normalized_cases)
normalized_cases = normalized_cases.sort_values(by="norm_count")
print(normalized_cases.head(5))
print(normalized_cases.tail(5))
# print(cases_obj)
# print(population_count)
# def get_normalized_casenum():

# print(average_case)
# # states = []