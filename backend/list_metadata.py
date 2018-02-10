import boto3
import os

from common.response import build_response

METADATA_TABLE = os.environ['METADATA_TABLE']
DYNAMO_DB = boto3.resource('dynamodb')


def handler(event, context):
    table = DYNAMO_DB.Table(METADATA_TABLE)
    result = table.scan()

    return build_response(200, result['Items'])
