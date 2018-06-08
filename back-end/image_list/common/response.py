import decimal
import json

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": True
}


def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body, cls=DecimalEncoder),
        'headers': HEADERS
    }


# This is a workaround for: http://bugs.python.org/issue16535
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)
