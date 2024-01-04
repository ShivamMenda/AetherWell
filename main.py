# Python 3.9.1 
import findspark
findspark.init()
from pyspark.sql import SparkSession
from pyspark.ml.feature import StringIndexer, OneHotEncoder 
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.feature import MinMaxScaler
from pyspark.ml.feature import PCA
from pyspark.ml.clustering import KMeans
from pyspark.ml.recommendation import ALS,ALSModel
from pyspark.ml.evaluation import RegressionEvaluator
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd


spark=SparkSession.builder.appName("HealthRecSystem").getOrCreate() # type: ignore
df=spark.read.csv("./datasets/sym_dia_diff.csv",header=True,inferSchema=True)
sym=spark.read.csv("./datasets/symptoms.csv",header=True,inferSchema=True)
dia=spark.read.csv("./datasets/diagnosis.csv",header=True,inferSchema=True)
# print("symptoms")
# sym.show(4)
# print("diagnosis")
# dia.show(4)
# print("diff")
# diff.show(4)
print("feature engineering started")
string_indexer=StringIndexer(inputCol="symptom",outputCol="symptom_index")
model=string_indexer.setHandleInvalid("skip").fit(df)
indexed=model.transform(df)
# indexed.show(4)
encoder=OneHotEncoder(dropLast=False,inputCols=["symptom_index"],outputCols=["symptom_vec"])
encoded=encoder.fit(indexed).transform(indexed)
df=encoded
# df.show(4)
string_indexer=StringIndexer(inputCol="diagnose",outputCol="diagnose_index")
model=string_indexer.setHandleInvalid("skip").fit(df)
indexed=model.transform(df)
# indexed.show(4)
encoder=OneHotEncoder(dropLast=False,inputCols=["diagnose_index"],outputCols=["diagnose_vec"])
encoded=encoder.fit(indexed).transform(indexed)
df=encoded
# df.show(4)
print("feature engineering completed")
print("feature scaling")
cols=["symptom","diagnose"]
for col in cols:
    scaler=MinMaxScaler(inputCol=col+"_vec",outputCol=col+"_vec_scaled")
    scaler_model=scaler.fit(df)
    scaler_data=scaler_model.transform(df)
    df=scaler_data
# df.show(4)
vec_assembler=VectorAssembler(inputCols=["symptom_vec_scaled","diagnose_vec_scaled"],outputCol="features")
df=vec_assembler.transform(df)
# df.show(4)
print("feature scaling completed")

print("PCA and Kmeans started")

kmeans=KMeans(k=2,seed=1)
model=kmeans.fit(df.select("features"))
transformed=model.transform(df)
df=transformed

# df.show(4)

pca=PCA(k=2,inputCol="features",outputCol="pcaFeatures")
model=pca.fit(df)
result=model.transform(df).select("pcaFeatures")
pandasDf=result.toPandas()
dataX=[]
dataY=[]
for vec in pandasDf.values:
    dataX.append(vec[0][0])
    dataY.append(vec[0][1])
print("PCA and Kmeans completed")


# plt.scatter(dataX,dataY)
# plt.show()

# sns.scatterplot(x=dataX,y=dataY)
# plt.title("PCA features")
# plt.show()

print("model training")
df=df.na.drop(subset=['syd','diagnose_index','wei'])
df=df.drop("prediction")
df.show(4)
print(type(df))
splits=df.randomSplit([0.75,0.25],24)
train=splits[0]
test=splits[1]
print("Training test size",train.count())
print("Test data size",test.count())
rec=ALS(maxIter=10,regParam=0.01,userCol="syd",itemCol="diagnose_index",nonnegative=True,ratingCol="wei",coldStartStrategy="drop")
rec_model=rec.fit(train)
rec_model.save("./models/als_model")
print("model training completed")

# print("model testing")
# rec_saved_model=ALSModel.load("./models/als_model")
# predicted_ratings=rec_saved_model.transform(test)
# predicted_ratings.show(8)
# evaluator=RegressionEvaluator(metricName="rmse",labelCol="wei",predictionCol="prediction")
# rmse=evaluator.evaluate(predicted_ratings)
# print("RMSE",rmse)
# wei_max_value=df.agg({'wei':'max'}).collect()[0][0]
# wei_min_value=df.agg({'wei':'min'}).collect()[0][0]

print("Loading model")
rec_saved_model=ALSModel.load("./models/als_model")
print("Model loaded")

def get_id(symptom):
    return int(df.filter(df["symptom"]==symptom).select("syd").collect()[0][0])


final_symptoms = []
# Get user input for symptoms
symptoms = list(input("Enter symptoms comma-separated: ").split(","))
print("Symptoms inputted:", symptoms)
for i in symptoms:
    final_symptoms.append(get_id(i))

# Get the recommended diagnosis
df1a = df.filter(df["syd"].isin(final_symptoms)).select('syd', 'did', 'diagnose_index', 'diagnose').orderBy('wei', ascending=False)
df1a.show(4)
recs = rec_saved_model.transform(df1a).orderBy('prediction', ascending=False)
print("Recommended diagnosis for symptoms:", symptoms)
recs.show(10, False)
spark.stop()
