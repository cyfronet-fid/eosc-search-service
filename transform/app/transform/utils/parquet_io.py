from typing import Optional

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq


def read_parquet(file_path: str) -> pd.DataFrame:
    """
    Read a Parquet file and returns its content as a Pandas DataFrame.
    """
    table = pq.read_table(file_path)
    return table.to_pandas()


def write_parquet(
    data: pd.DataFrame, file_path: str, compression: Optional[str] = "snappy"
) -> None:
    """Write a Pandas DataFrame to a Parquet file."""
    pq_table = pa.Table.from_pandas(data)
    pq.write_table(pq_table, file_path, compression=compression)
