"""
based on https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/
blob/master/blueprints/python/api-gateway-authorizer-python.py
"""
import jwt
import os
import re

SECRET = os.environ['AUTH0_SECRET']
AUTH0_CLIENT_ID = os.environ['AUTH0_CLIENT_ID']


def handler(event, context):
    auth_token = event['authorizationToken']
    if not auth_token:
        raise Exception('Unauthorized')

    token = auth_token.split(' ')[1]

    try:
        payload = jwt.decode(token, SECRET, algorithms=['HS256'], audience=AUTH0_CLIENT_ID)
    except jwt.InvalidTokenError:
        raise Exception('Unauthorized')
    else:
        return get_auth_response(payload['email'], event)


def get_auth_response(principal_id, event):
    """
    Builds auth response allowing all methods
    """
    aws_region, aws_account_id, api_gateway_info = event['methodArn'].split(':')[3:]
    api_gateway_id, stage = api_gateway_info.split('/')[:2]

    # tmp = event['methodArn'].split(':')
    # api_gateway_arn_tmp = tmp[5].split('/')
    # aws_account_id = tmp[4]
    # rest_api_id = api_gateway_arn_tmp[0]
    # aws_region = tmp[3]
    # stage = api_gateway_arn_tmp[1]

    policy = AuthPolicy(principal_id, aws_account_id, api_gateway_id, aws_region, stage)
    policy.allow_all_methods()
    auth_response = policy.build()
    context = {
        'user_id': principal_id
    }

    auth_response['context'] = context

    return auth_response


class HttpVerb:
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    HEAD = "HEAD"
    DELETE = "DELETE"
    OPTIONS = "OPTIONS"
    ALL = "*"


class AuthPolicy(object):
    # The policy version used for the evaluation. This should always be '2012-10-17'
    version = "2012-10-17"

    # The regular expression used to validate resource paths for the policy
    path_regex = "^[/.a-zA-Z0-9-\*]+$"

    def __init__(self, principal_id, aws_account_id, rest_api_id='*', region='*', stage='*'):
        self.aws_account_id = aws_account_id
        self.principal_id = principal_id
        self.allow_methods = []
        self.deny_methods = []
        self.rest_api_id = rest_api_id
        self.region = region
        self.stage = stage

    def _add_method(self, effect, verb, resource, conditions):
        """
        Adds a method to the internal lists of allowed or denied methods. Each object in
        the internal list contains a resource ARN and a condition statement. The condition
        statement can be null.
        """

        if verb != "*" and not hasattr(HttpVerb, verb):
            raise NameError("Invalid HTTP verb " + verb + ". Allowed verbs in HttpVerb class")
        resource_pattern = re.compile(self.path_regex)
        if not resource_pattern.match(resource):
            raise NameError("Invalid resource path: " + resource + ". Path should match " + self.path_regex)

        if resource[:1] == "/":
            resource = resource[1:]

        resource_arn = (
            "arn:aws:execute-api:" +
            self.region + ":" +
            self.aws_account_id + ":" +
            self.rest_api_id + "/" +
            self.stage + "/" +
            verb + "/" +
            resource
        )

        if effect.lower() == "allow":
            self.allow_methods.append({
                'resourceArn': resource_arn,
                'conditions': conditions
            })
        elif effect.lower() == "deny":
            self.deny_methods.append({
                'resourceArn': resource_arn,
                'conditions': conditions
            })

    @staticmethod
    def _get_empty_statement(effect):
        """
        Returns an empty statement object prepopulated with the correct action and the
        desired effect.
        """
        statement = {
            'Action': 'execute-api:Invoke',
            'Effect': effect[:1].upper() + effect[1:].lower(),
            'Resource': []
        }

        return statement

    def _get_statement_for_effect(self, effect, methods):
        """
        This function loops over an array of objects containing a resourceArn and
        conditions statement and generates the array of statements for the policy.
        """
        statements = []

        if len(methods) > 0:
            statement = self._get_empty_statement(effect)

            for method in methods:
                if not method['conditions']:
                    statement['Resource'].append(method['resourceArn'])
                else:
                    conditional_statement = self._get_empty_statement(effect)
                    conditional_statement['Resource'].append(method['resourceArn'])
                    conditional_statement['Condition'] = method['conditions']
                    statements.append(conditional_statement)

            statements.append(statement)

        return statements

    def allow_all_methods(self):
        """
        Adds a '*' allow to the policy to authorize access to all methods of an API
        """
        self._add_method("Allow", HttpVerb.ALL, "*", [])

    def build(self):
        """
        Generates the policy document based on the internal lists of allowed and denied
        conditions. This will generate a policy with two main statements for the effect:
        one statement for Allow and one statement for Deny.
        Methods that includes conditions will have their own statement in the policy.
        """
        if not (self.allow_methods or self.deny_methods):
            raise NameError("No statements defined for the policy")

        policy = {
            'principalId': self.principal_id,
            'policyDocument': {
                'Version': self.version,
                'Statement': []
            }
        }

        policy['policyDocument']['Statement'].extend(
            self._get_statement_for_effect("Allow", self.allow_methods)
        )
        policy['policyDocument']['Statement'].extend(
            self._get_statement_for_effect("Deny", self.deny_methods)
        )

        return policy
