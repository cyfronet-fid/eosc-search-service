# # pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
# """Load, transform and send data"""
# import requests
# from tqdm import tqdm
# import transform.transformers as trans
# from app.services.spark.spark import apply_spark_conf
# from transform.utils.loader import *
# from transform.utils.utils import (
#     print_results,
#     print_errors,
# )
# from transform.utils.validate import (
#     check_schema_after_trans,
# )
# from transform.utils.save import (
#     save_df,
#     create_dump_struct,
#     make_archive,
# )
# from transform.utils.send import (
#     send_data,
#     failed_files,
# )
#
#
# def upload_all_col_data() -> None:
#     """Upload data to all collection & other collection on demand"""
#     for col_name, col_prop in env_vars[ALL_COLLECTION].items():
#         if col_prop.get(PATH):
#             # Data provided via files
#             col_input_dir = col_prop[PATH]
#             data_points = sorted(os.listdir(col_input_dir))
#         else:
#             # Data from API
#             data_points = col_prop[ADDRESS].split(" ")
#
#         for data_num, data_point in enumerate(tqdm(data_points, desc=col_name)):
#             if col_prop.get(PATH):
#                 file_path = os.path.join(col_input_dir, data_point)
#                 df = load_file_data(spark, file_path, col_name)
#             else:
#                 df = requests.get(data_point, timeout=20).json()["results"]
#                 if col_name != GUIDELINE:
#                     df = load_file_data(spark, df, col_name)
#
#             # Transform
#             try:
#                 if col_name == GUIDELINE:
#                     # Transform using Pandas
#                     df_trans = trans.all_col_trans_map[col_name](df)
#                 else:
#                     # Transform using Spark
#                     df_trans = trans.all_col_trans_map[col_name](spark)(df)
#             except (ValueError, AssertionError, KeyError):
#                 print_errors(
#                     "transform_fail", failed_files, col_name, data_point, logger
#                 )
#                 continue
#
#             # Check the consistency of transformation
#             if col_name != GUIDELINE:
#                 try:
#                     check_schema_after_trans(df_trans, col_prop[OUTPUT_SCHEMA])
#                 except AssertionError:
#                     print_errors(
#                         "consistency_fail", failed_files, col_name, data_point, logger
#                     )
#                     continue
#
#             save_df(
#                 df_trans,
#                 col_name,
#                 env_vars[OUTPUT_PATH],
#                 _format=env_vars[OUTPUT_FORMAT],
#             )
#
#             send_data(env_vars, col_name, data_point, data_num)
#
#
# if __name__ == "__main__":
#     spark, logger = apply_spark_conf()
#     env_vars = load_env_vars()
#     create_dump_struct(env_vars)
#
#     # All collection
#     upload_all_col_data()
#
#     if env_vars[CREATE_LOCAL_DUMP]:
#         make_archive(env_vars)
#
#     print_results(failed_files, logger)
