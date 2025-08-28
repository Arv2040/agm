import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import xgboost as xgb
from db.db_setup import demand_collection

def predict_demand():
    data = pd.DataFrame(list(demand_collection.find()))
    le_type = LabelEncoder()
    le_loc = LabelEncoder()
    data["Vehicle_Type_Code"] = le_type.fit_transform(data["vehicle_type"])
    data["Location_Code"] = le_loc.fit_transform(data["location"])
    X = data[["Vehicle_Type_Code", "Location_Code", "runtime_hours", "idle_hours", "fuel_used", "downtime_hours"]]
    y = (data["runtime_hours"] > data["runtime_hours"].median()).astype(int)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, objective='binary:logistic')
    model.fit(X_train, y_train)
    data["Predicted_Demand"] = ["High" if i==1 else "Low" for i in model.predict(X)]
    return data[["vehicle_type", "location", "Predicted_Demand"]]
