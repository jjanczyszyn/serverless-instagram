## Important Serverless commands

Every serverless command starts with `serverless` or shorter `sls`

Serverless python hello world (source: https://serverless.com/framework/docs/providers/aws/examples/hello-world/python/):

<img width="524" alt="screen shot 2018-02-11 at 10 59 50" src="https://user-images.githubusercontent.com/4153982/36075289-c7e1bd76-0f1a-11e8-9dd1-a464078d6d62.png">

<img width="521" alt="screen shot 2018-02-11 at 10 59 40" src="https://user-images.githubusercontent.com/4153982/36075288-c7ccf83c-0f1a-11e8-9cf9-588247973cbb.png">


The basic deploy command: `sls deploy`

It produces the following output for our stack (of course API Gateway endpoints are different for everybody)

<img width="610" alt="screen shot 2018-02-11 at 10 22 38" src="https://user-images.githubusercontent.com/4153982/36074979-a0d9728c-0f15-11e8-8635-61ecf43d5236.png">

It's possible to limit commands to a single lambda function e.g. when we want to redeploy just a single function or check it's logs.

`sls deploy -f {function_name}`

<img width="461" alt="screen shot 2018-02-11 at 10 25 50" src="https://user-images.githubusercontent.com/4153982/36075018-31141492-0f16-11e8-8f7e-7a9cb29f438b.png">

`sls logs -f {function_name}`

<img width="746" alt="screen shot 2018-02-11 at 10 27 07" src="https://user-images.githubusercontent.com/4153982/36075022-34d26ad4-0f16-11e8-8112-1a0373a4a423.png">

In order to get the information about our service we can use `sls info`

<img width="573" alt="screen shot 2018-02-11 at 10 26 01" src="https://user-images.githubusercontent.com/4153982/36075024-3733b166-0f16-11e8-9b6b-d2d900286b38.png">

When we want to clean up and remove the service from AWS we can run `sls remove`.
This should remove all the resources created in the AWS, leaving only the ones having `DeletionPolicy: Retain` specified.
In our case S3 buckets.
