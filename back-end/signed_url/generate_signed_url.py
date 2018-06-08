import logging
import os
import uuid
import boto3
import mimetypes

from common.response import build_response

s3 = boto3.client('s3')
mimetypes.init()

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

BUCKET = os.environ['UPLOAD_IMAGE_BUCKET_NAME']


def handler(event, context):
    logger.info('Received event: {}'.format(event))
    content_type = event.get('queryStringParameters', {}).get('content_type')
    if not content_type:
        return build_response(400, {'message': 'Missing content_type query parameter!'})

    key = generate_key(content_type)
    params = {
        'Bucket': BUCKET,
        'Key': key,
        'ACL': 'public-read',
        'ContentType': content_type,
        'Metadata': {'user': event['requestContext']['authorizer']['principalId']}
    }

    url = s3.generate_presigned_url(
        'put_object',
        Params=params,
        ExpiresIn=1000,
        HttpMethod='PUT'
    )

    return build_response(200, {'url': url, 'key': key, 'content_type': content_type})


def generate_key(content_type):
    file_extension = mimetypes.guess_extension(content_type, strict=False)
    key = str(uuid.uuid1())
    if file_extension:
        return key + file_extension
    return key
