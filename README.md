# serverless-instagram

A serverless image sharing application example using Serverless Framework

# Disclaimer
**These steps are for linux or OSX systems. All of this is achievable using Windows but those instructions have not been provided.**

**This is only a demo and is not production ready.**

## Dependencies
* AWS Account + user with API keys with the appropriate policy ([policy template](aws-policy-for-serverless.json))
* Auth0 Account (info on how to set it up -> [auth0.md](docs/auth0.md))
* Docker (only for Mac and Windows)
* AWS CLI [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
* Node > 6 (tested with 6 and 8)
* `npm install serverless -g`

## Authentication

1. To set up the website `cd front-end` and follow instructions in [readme](front-end/readme.md).
2. `cd ../`
3. To set up the lambda authorizer function `cd back-end` and follow instructions in [readme](back-end/readme.md).

<img width="912" alt="screen shot 2018-05-16 at 09 31 08" src="https://user-images.githubusercontent.com/4153982/40119965-0432f892-58ec-11e8-8048-8d845d9a45d0.png">

<img width="889" alt="screen shot 2018-06-03 at 08 16 45" src="https://user-images.githubusercontent.com/4153982/40883833-7caea9ba-6706-11e8-9aa1-046e9232c22d.png">
