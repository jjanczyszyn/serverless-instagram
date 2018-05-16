# serverless-instagram

A serverless image sharing application example using Serverless Framework

# Disclaimer
**These steps are for linux or OSX systems. All of this is achievable using Windows but those instructions have not been provided.**

**This is only a demo and is not production ready.**

# Setup
## Dependencies
* AWS Account + user with API keys with the appropriate policy ([policy template](aws-policy-for-serverless.json))
* Auth0 Account (info on how to set it up -> [auth0.md](docs/auth0.md))
* Docker (only for Mac and Windows)
* AWS CLI [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
* Node > 6 (tested with 6 and 8)
* `npm install serverless -g`

## Back-end Configuration Steps
1. Install the dependencies listed above.
2. Create a configuration file in the [`backend`](backend) directory based on the example config [`config.json.example`](backend/config.json.example) named config.json

## Back-end deployment steps
1. `cd backend`
2. `npm install`
3. `sls deploy`

## Website Configuration Steps
1. In the [`website/js`](website/js) directory create a `config.js` file based on the [`config.js.example`](website/config.js.example) file given.
2. Copy the API gateway base url (e.g. https://xx.execute-api.us-east-1.amazonaws.com/dev) into `apiBaseUrl` in your `website/js/config.js` file.

## Website
1. `cd website`
2. `npm install`
3. `npm start`
4. Open your browser to [http://localhost:8100](http://localhost:8100)

## Additional docs
More info on how to use the serverless commands can be found in [serverless commands](docs/serverless.md)

## Overview of how things work
<img width="912" alt="screen shot 2018-05-16 at 09 31 08" src="https://user-images.githubusercontent.com/4153982/40119965-0432f892-58ec-11e8-8048-8d845d9a45d0.png">

<img width="942" alt="screen shot 2018-05-16 at 09 31 16" src="https://user-images.githubusercontent.com/4153982/40119969-0524dff4-58ec-11e8-95a0-94b6b3501eba.png">

<img width="920" alt="screen shot 2018-05-16 at 09 31 24" src="https://user-images.githubusercontent.com/4153982/40119972-069e333a-58ec-11e8-95aa-a02bbfb8178f.png">

<img width="1010" alt="screen shot 2018-05-16 at 09 31 30" src="https://user-images.githubusercontent.com/4153982/40119975-080b77c8-58ec-11e8-9301-26f1d2e8c7ae.png">

<img width="1015" alt="screen shot 2018-05-16 at 09 31 40" src="https://user-images.githubusercontent.com/4153982/40119976-09fe3278-58ec-11e8-8c22-a0ba635dbc44.png">


## Credits:

This workshop has been inspired by:
* https://github.com/ACloudGuru/serverless-workshop
* https://github.com/ACloudGuru/serverless-framework-video-example

The camera image has been taken from:
http://vectips.com/tips-and-tricks/how-to-create-a-camera-icon/

## Licensing

This source code repository uses the MIT license and includes
unmodified versions of open-source libraries whose licenses are
either the same or compatible.

Here is a list of libraries being distributed and respective their
licenses.

| Library           | License |
| ----------------- | ------- |
| Auth0-Lock 8.3.2  | [MIT](https://github.com/auth0/lock/blob/v8.3.2/LICENSE) |
| Bootstrap 3.3.1   | [MIT](https://github.com/twbs/bootstrap/blob/v3.3.1/LICENSE) |
| jQuery 1.11.2     | [MIT](https://jquery.org/license/) |
| moment.js         | [MIT](https://github.com/moment/moment/blob/develop/LICENSE) |
| modernizr         | [MIT](https://modernizr.com/license/)

### NOTE:

Some snippets of code were copied from various places in the internet,
we made our best efforts to ensure that the original code and authors
were referenced on the inline comments.
