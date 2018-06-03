import boto3
import logging
import os
import time

IMAGE_INFO_TABLE_NAME = os.environ['IMAGE_INFO_TABLE_NAME']
DYNAMO_DB = boto3.resource('dynamodb')
TABLE = DYNAMO_DB.Table(IMAGE_INFO_TABLE_NAME)

S3 = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info('Received event: {}'.format(event))
    key = event['Records'][0]['s3']['object']['key']
    bucket = event['Records'][0]['s3']['bucket']['name']

    item = {
        'user': get_s3_object_author(bucket, key),
        'image': 'https://s3.amazonaws.com/{}/{}'.format(bucket, key),
        'createdAt': int(time.time() * 1000),
    }

    TABLE.put_item(Item=item)


def get_s3_object_author(bucket, key):
    response = S3.head_object(Bucket=bucket, Key=key)
    logger.info('Response: {}'.format(response))

    return response['Metadata']['user']
