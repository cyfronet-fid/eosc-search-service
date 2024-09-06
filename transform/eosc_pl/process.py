"""Get, transform, upload data"""

from eosc_pl.transform.utils.config import get_config, DATASET_ADDRESS
from eosc_pl.transform.utils.loader import pd_load_datasets
import eosc_pl.transform.transformers.pd as trans
from eosc_pl.transform.transformers.pd.dataset import DATASET
from eosc_pl.transform.utils.send import send_json_string_to_solr

if __name__ == "__main__":
    conf = get_config()
    # Load
    datasets_raw = pd_load_datasets(conf[DATASET_ADDRESS])

    # Transform
    datasets = trans.transformers[DATASET]()(datasets_raw)

    # Send
    datasets_json = datasets.to_json(orient="records")
    send_json_string_to_solr(datasets_json, conf)
