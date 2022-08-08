"""Join OAG, trainings and services (optional) into one "all" collection"""
from pyspark.sql import SparkSession
from transform.all_collection.spark.conf.spark_conf import get_spark_app_config
from transform.all_collection.spark.conf.logger import Log4J
from transform.all_collection.spark.utils.loader import load_data
from transform.all_collection.spark.utils.load_env_vars import (
    load_env_vars,
    DATASETS,
    PUBLICATIONS,
    SOFTWARE,
    TRAININGS,
    SERVICES,
    OUTPUT_PATH,
    INPUT_FORMAT,
    OUTPUT_FORMAT,
)
from transform.all_collection.spark.transform_df.datasets_transform import (
    transform_datasets,
)
from transform.all_collection.spark.transform_df.publications_transfrom import (
    transform_publications,
)
from transform.all_collection.spark.transform_df.software_transfrom import (
    transform_software,
)
from transform.all_collection.spark.transform_df.trainings_transform import (
    transform_trainings,
)
from transform.all_collection.spark.transform_df.services_transform import (
    transform_services,
)
from transform.all_collection.spark.utils.join_dfs import join_dfs
from transform.all_collection.spark.utils.save_df import save_df
from transform.all_collection.spark.utils.replace_empty_str import replace_empty_str


if __name__ == "__main__":
    conf = get_spark_app_config()
    spark = SparkSession.builder.config(conf=conf).getOrCreate()
    logger = Log4J(spark)

    # Load
    data_paths, data_formats = load_env_vars()
    loaded_data = load_data(spark, data_paths, _format=data_formats[INPUT_FORMAT])

    # Transform
    datasets = transform_datasets(loaded_data[DATASETS])
    publications = transform_publications(loaded_data[PUBLICATIONS])
    software = transform_software(loaded_data[SOFTWARE])
    trainings = transform_trainings(loaded_data[TRAININGS])

    resources_to_join = [datasets, publications, software, trainings]
    if loaded_data[SERVICES]:
        services = transform_services(loaded_data[SERVICES], spark=spark)
        resources_to_join.append(services)

    # Join
    joined_df = replace_empty_str(join_dfs(resources_to_join))

    # Save
    save_df(
        joined_df, data_paths[OUTPUT_PATH], logger, _format=data_formats[OUTPUT_FORMAT]
    )
