# pylint: disable=line-too-long, too-many-arguments, consider-using-with, invalid-name, logging-fstring-interpolation
"""Module to send data"""
import logging
import requests
from requests.exceptions import ConnectionError as ReqConnectionError
from app.services.solr.errors import SolrException
from app.settings import settings

logger = logging.getLogger(__name__)

SOLR = "SOLR"
S3 = "S3"

req_headers = {"Accept": "application/json", "Content-Type": "application/json"}
# failed_files = {
#     PROVIDER: {SOLR: [], S3: []},
#     SERVICE: {SOLR: [], S3: []},
#     DATASOURCE: {SOLR: [], S3: []},
#     OFFER: {SOLR: [], S3: []},
#     BUNDLE: {SOLR: [], S3: []},
#     GUIDELINE: {SOLR: [], S3: []},
#     TRAINING: {SOLR: [], S3: []},
#     OTHER_RP: {SOLR: [], S3: []},
#     SOFTWARE: {SOLR: [], S3: []},
#     DATASET: {SOLR: [], S3: []},
#     PUBLICATION: {SOLR: [], S3: []},
# }


# def send_data(
#     col_name: str,
#     file: str,
#     file_num: int = 0,
# ) -> None:
#     """Send data to appropriate places / create local dump"""
#     if settings.SEND_TO_SOLR:
#         send_to_solr(col_name, file, file_num)
#
#     if settings.SEND_TO_S3:
#         send_to_s3(col_name, file, file_num)


def send_json_string_to_solr(
    data: str,
    col_name: str,
) -> None:
    """Send json string data to solr"""
    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]

    for s_col_name in solr_col_names:
        url = f"{settings.SOLR_URL}solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(url, data=data, headers=req_headers, timeout=180)
            if req.status_code == 200:
                logger.info(
                    f"{req.status_code} update was successful. Data type={col_name}, solr_col={s_col_name}"
                )
            else:
                logger.error(
                    f"{req.status_code} update failed. Data type={col_name}, solr_col={s_col_name}. Data has failed to be sent to Solr. Details: {req.json()}"
                )
                raise SolrException(req.json())
        except ReqConnectionError as e:
            logger.error(
                f"Connection failed {url=}. Update failed. Data type={col_name}, solr_col={s_col_name}. Solr is not reachable. Details: {e}"
            )
            raise SolrException(e)


# def send_to_solr(
#     col_name: str,
#     file: str,
#     file_num: int = 0,
# ) -> None:
#     """Send data to solr"""
#     file_to_send = get_output_path(col_name, file_num)
# solr_col_names = getattr(settings.COLLECTIONS, col_name)["SOLR_COL_NAMES"]
#     req_statuses = []
#
#     for s_col_name in solr_col_names:
#         url = f"{settings.SOLR_URL}solr/{s_col_name}/update/json/docs"
#         try:
#             req = requests.post(
#                 url, data=open(file_to_send, "rb"), headers=req_headers, timeout=180
#             )
#             if req.status_code != 200:
#                 logger.error(
#                     f"Cyclic updated failed to be sent to solr. {col_name=} status={req.status_code}"
#                 )
#             req_statuses.append(req.status_code)
#         except ReqConnectionError:
#             req_statuses.append(500)
#
#     if any((status != 200 for status in req_statuses)):
#         failed_files[col_name][SOLR].append(file)
#         for num, status in enumerate(req_statuses):
#             if status != 200:
#                 logger.error(
#                     f"{col_name} - {file} failed to be sent to the Solr collection: {solr_col_names[num]}, status={status}"
#                 )

# TODO refactor to send json string, not a file. Also zip the result
# def send_to_s3(
#     col_name: str,
#     file: str,
#     file_num: int = 0,
# ) -> None:
#     """Send data to S3"""
#
#     s3 = connect_to_s3(
#                 settings.S3_ACCESS_KEY, settings.S3_SECRET_KEY, settings.S3_ENDPOINT
#     )
#     file_to_send_path = get_output_path(col_name, file_num)
#     file_to_send_name = file_to_send_path.split("/")[-1]
#     s3_path = os.path.join(str(date.today()), col_name.lower(), file_to_send_name)
#
#     try:
#         s3.upload_file(
#             Filename=file_to_send_path, Bucket=settings.S3_BUCKET, Key=s3_path
#         )
#     except (ClientError, EndpointConnectionError) as err:
#         failed_files[col_name][S3].append(file)
#         logger.error(f"{col_name} - {file} failed to be sent to the S3 - {err}")
#
#
# def get_output_path(col_name: str, file_num: int = 0) -> str:
#     """Rename the output file and get the path of the output file"""
#     _format = f".{settings.OUTPUT_FORMAT.lower()}"
#     desired_file_name = str(file_num) + "_" + col_name.lower() + _format
#     output_files = os.listdir(settings.OUTPUT_PATH)
#     output_path = None
#     for file in output_files:
#         if _format in file and ".crc" not in file:
#             output_path = os.path.join(settings.OUTPUT_PATH, desired_file_name)
#             os.rename(os.path.join(settings.OUTPUT_PATH, file), output_path)
#             break
#
#     return output_path
