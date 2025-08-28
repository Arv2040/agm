import pandas as pd
from pymongo import MongoClient
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.metrics import accuracy_score, classification_report

def predict_demand_mongo(uri, db_name, collection_name):
    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]
    data = pd.DataFrame(list(collection.find()))

    threshold = data["Past_Usage"].median()
    data["Demand_Label"] = data["Past_Usage"].apply(lambda x: 1 if x > threshold else 0)

    X = data.drop(["Past_Usage", "Demand_Label"], axis=1)
    y = data["Demand_Label"]

    le = LabelEncoder()
    X["Vehicle_Type"] = le.fit_transform(X["Vehicle_Type"])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, objective='binary:logistic')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    all_vehicles = X.copy()
    predicted_labels_all = model.predict(all_vehicles)
    all_vehicles["Predicted_Demand"] = ["High" if i==1 else "Low" for i in predicted_labels_all]
    print(all_vehicles)
