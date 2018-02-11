# serverless-instagram

A serverless image sharing application example using Serverless Framework

# Disclaimer
**These steps are for linux or OSX systems. All of this is achievable using Windows but those instructions have not been provided.**

**This is only a demo and is not production ready.**

# Setup
## Dependencies
* AWS Account
* Auth0 Account
* Docker (only for Mac and Windows)
* AWS CLI [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
* Node 6.10.x

## Configuration Steps
1. Install the dependencies listed above.
2. Create a configuration file for your stage in the [`backend`](backend) directory based on the example config [`config.json.example`](backend/config.json.example) named config.json
5. In the [`website/js`](website/js) directory create a `config.js` file based on the [`config.js.example`](website/config.js.example) file given.

## Backend deployment steps
1. `cd backend`
2. `npm install`
3. `sls deploy`

## Website
1. `cd website`
2. Copy the API gateway base url into your `website/js/config.js` file.
3. `npm install`
4. `npm run start`
5. Open your browser to [http://localhost:8100](http://localhost:8100)


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
