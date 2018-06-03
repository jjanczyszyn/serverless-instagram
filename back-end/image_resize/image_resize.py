import boto3
import os
import logging
from PIL import Image, ImageOps

RESIZED_IMAGE_BUCKET_NAME = os.environ['RESIZED_IMAGE_BUCKET_NAME']
UPLOAD_IMAGE_BUCKET_NAME = os.environ['UPLOAD_IMAGE_BUCKET_NAME']

s3 = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    logger.info('Received event: {}'.format(event))
    key = event['Records'][0]['s3']['object']['key']
    bucket_input = event['Records'][0]['s3']['bucket']['name']

    bucket_output = RESIZED_IMAGE_BUCKET_NAME

    download_path = '/tmp/original-' + key
    upload_path = '/tmp/' + key

    s3.download_file(bucket_input, key, download_path)

    resize_image(download_path, upload_path)

    s3.upload_file(
        upload_path, bucket_output, key,
        ExtraArgs=get_s3_object_extra_args(key)
    )


def resize_image(image_path, resized_path):
    with Image.open(image_path) as image:
        thumb = ImageOps.fit(image, (600, 600), Image.ANTIALIAS)
        thumb.save(resized_path)


def get_s3_object_extra_args(key):
    response = s3.head_object(Bucket=UPLOAD_IMAGE_BUCKET_NAME, Key=key)
    logger.info('Response: {}'.format(response))
    extra_args = {
        'Metadata': response['Metadata'],
        'ContentType': response['ContentType']
    }
    return extra_args
