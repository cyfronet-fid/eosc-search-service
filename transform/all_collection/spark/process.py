# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Load, transform and send data"""
import os
from tqdm import tqdm
import transform.all_collection.spark.transformations as trans
from transform.all_collection.spark.conf.spark import apply_spark_conf
from transform.all_collection.spark.utils.loader import *
from transform.all_collection.spark.utils.utils import (
    check_dfs_cols,
    check_trans_consistency,
    print_results,
    print_errors,
)
from transform.all_collection.spark.utils.save_df import save_df
from transform.all_collection.spark.schemas.harvested_props_schemas import (
    harvested_schemas,
)
from transform.all_collection.spark.utils.send_data import send_to_solr

failed_files = {
    DATASET: [],
    PUBLICATION: [],
    SOFTWARE: [],
    OTHER_RP: [],
    TRAINING: [],
    SERVICE: [],
    DATASOURCE: [],
}

if __name__ == "__main__":
    spark, logger = apply_spark_conf()
    env_vars = load_env_vars()
    check_trans_consistency(env_vars[COLLECTIONS], spark, logger)

    for col_name, col_prop in env_vars[COLLECTIONS].items():
        col_input_dir = col_prop[PATH]
        files = sorted(os.listdir(col_input_dir))
        solr_col_names = col_prop[NAMES].split(" ")

        for file in tqdm(files, desc=col_name):
            file_path = col_input_dir + file
            df = load_data(spark, file_path, col_name)
            # Transform
            try:
                df_trans = trans.trans_map[col_name](
                    df, harvested_schemas[col_name], spark
                )
            except (ValueError, AssertionError, KeyError):
                print_errors("transform_fail", failed_files, col_name, file, logger)
                continue

            # Check transformation consistency
            try:
                check_dfs_cols((df_trans, col_prop[FIRST_FILE_DF]))
            except AssertionError:
                print_errors("consistency_fail", failed_files, col_name, file, logger)
                continue

            # Save df
            save_df(
                df_trans,
                env_vars[OUTPUT_PATH],
                logger,
                _format=env_vars[OUTPUT_FORMAT],
            )

            # Send data to Solr
            send_to_solr(solr_col_names, env_vars, failed_files, col_name, file, logger)

    print_results(failed_files, logger)
