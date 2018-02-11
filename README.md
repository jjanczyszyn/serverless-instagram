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
2. Create a configuration file for your stage in the [`backend`](backend) directory based on the example config [`config-dev.yml.example`](backend/config-dev.yml.example) . The name of the file should be in the format `config-<your-stage-name>.yml`.
5. In the [`website/js`](website/js) directory create a `config.js` file based on the [`config.js.example`](website/config.js.example) file given.

## Backend deployment steps
1. `cd backend`
2. `npm install`
3. `sls -s <your-stage-name> deploy`

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
