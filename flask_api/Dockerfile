# Use an openjdk base image
FROM openjdk:8-jdk

# Set the working directory
WORKDIR /app

# Install Python 3 and pip
RUN apt-get update && apt-get install -y python3-pip

# Copy the requirements.txt file into the container
COPY requirements.txt /app/
COPY datasets /app/datasets
COPY models/ /app/models
COPY app.py /app/

# Install the Python libraries
RUN pip3 install -r requirements.txt

# Download and install Spark
# RUN curl -O https://archive.apache.org/dist/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz
# RUN tar xvf spark-3.1.2-bin-hadoop3.2.tgz
COPY spark/spark-3.1.2-bin-hadoop3.2 /spark

# Set environment variables for Spark and PySpark
ENV SPARK_HOME=/spark
ENV PATH=$PATH:/spark/bin
ENV PYSPARK_PYTHON=python3

# Expose the port your app runs on
EXPOSE 4000

# Run your app
CMD ["python3", "app.py"]