import findspark
findspark.init()
from pyspark.sql import SparkSession
from pyspark.sql.functions import lower,trim
from pyspark.ml.recommendation import ALSModel
from flask import Flask, request, jsonify,Response
import json
import os

spark=SparkSession.builder.appName("HealthRecAPI").getOrCreate()
app=Flask(__name__)

@app.route("/")
def home():
    return "Welcome to HealthRecAPI"

@app.route("/get_all_symptoms", methods=["GET"])
def get_all_symptoms():
    print("Loading data")
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT,'symptoms.json')
    data = json.load(open(json_url))
    print("Data loaded")
    return jsonify(data)

@app.route("/predict/", methods=["POST"])
def predict():
    try:
        print("Loading data")
        df=spark.read.csv("./datasets/final.csv",header=True,inferSchema=True)
        print("Data loaded")
        rec_saved_model=ALSModel.load("./models/als_model")
        print("Starting Prediction")
        print("Getting ID")
        def get_id(symptom):
            symptom = symptom.lower().strip()  # convert input symptom to lowercase and remove leading/trailing whitespace
            rows = df.filter(lower(trim(df["symptom"])) == symptom).select("syd").collect()
            if rows:
                return int(rows[0][0])
            else:
                return None
        print("ID fetched")
        # Get user input for symptoms
        symptoms=request.json["symptoms"]
        final_symptoms = []
        for i in symptoms:
            final_symptoms.append(get_id(i))

        # Get the recommended diagnosis
        df1a = df.filter(df["syd"].isin(final_symptoms)).select('syd', 'did', 'diagnose_index', 'diagnose').orderBy('wei', ascending=False)
        recs = rec_saved_model.transform(df1a).orderBy('prediction', ascending=False)
        recs=recs.select('diagnose','prediction').limit(10)
        result = recs.toPandas().to_json(orient="records")
        result = json.loads(result)  # load the JSON string as a Python object
        response = {
        "result": result,
        "value_input": symptoms,
        "message": "Success"
        }

        return Response(json.dumps(response,ensure_ascii=True), mimetype='application/json')
    except Exception as e:
        response = {
        "result": [],
        "value_input": symptoms,
        "message": "Error",
        "error": str(e)
        }
        return Response(json.dumps(response,ensure_ascii=True), mimetype='application/json')

if __name__=="__main__":
    app.run(host="0.0.0.0",debug=True,port=4000)