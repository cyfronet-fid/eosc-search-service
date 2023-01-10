# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Load, transform and send data"""
from tqdm import tqdm
import transform.transformers as trans
from transform.conf.spark import apply_spark_conf
from transform.utils.loader import *
from transform.utils.utils import (
    print_results,
    print_errors,
)
from transform.utils.validate import check_trans_consistency, check_dfs_cols
from transform.utils.save import (
    save_df,
    create_dump_struct,
    make_archive,
)
from transform.utils.send import (
    send_data,
    failed_files,
)

if __name__ == "__main__":
    spark, logger = apply_spark_conf()
    env_vars = load_env_vars()
    check_trans_consistency(env_vars[COLLECTIONS], spark, logger)
    create_dump_struct(env_vars)

    for col_name, col_prop in env_vars[COLLECTIONS].items():
        col_input_dir = col_prop[PATH]
        files = sorted(os.listdir(col_input_dir))

        for file_num, file in enumerate(tqdm(files, desc=col_name)):
            file_path = col_input_dir + file
            df = load_data(spark, file_path, col_name)
            # Transform
            try:
                df_trans = trans.trans_map[col_name](spark)(df)
            except (ValueError, AssertionError, KeyError):
                print_errors("transform_fail", failed_files, col_name, file, logger)
                continue

            # Check transformation consistency
            try:
                check_dfs_cols((df_trans, col_prop[FIRST_FILE_DF]))
            except AssertionError:
                print_errors("consistency_fail", failed_files, col_name, file, logger)
                continue

            save_df(
                df_trans,
                env_vars[OUTPUT_PATH],
                logger,
                _format=env_vars[OUTPUT_FORMAT],
            )

            send_data(env_vars, col_name, file, file_num, logger)

    if env_vars[CREATE_LOCAL_DUMP]:
        make_archive(env_vars)

    print_results(failed_files, logger)