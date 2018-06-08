import logging
import os

import boto3
from boto3.dynamodb.conditions import Key

from common.response import build_response

IMAGE_INFO_TABLE_NAME = os.environ['IMAGE_INFO_TABLE_NAME']
DYNAMO_DB = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info('Received event: {}'.format(event))
    user = event['requestContext']['authorizer']['principalId']

    table = DYNAMO_DB.Table(IMAGE_INFO_TABLE_NAME)
    filtering_exp = Key('user').eq(user)
    result = table.query(KeyConditionExpression=filtering_exp, ScanIndexForward=False)

    return build_response(200, result['Items'])
