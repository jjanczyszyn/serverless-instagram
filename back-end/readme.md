## Authorization with Auth0

1. Create a configuration file named config.json, use [the example config](config.json.example).
2. Run `sls deploy`.
3. Create an event file named event.json, use [the example event](event.json.example). Substitute **_\<your Auth0 token>_** with the token you copied from auth0 user information while following instructions in [front-end/ readme](../front-end/readme.md).
4. Run `sls invoke -f authorizer -p event.json`


<img width="672" alt="screen shot 2018-06-02 at 15 33 52" src="https://user-images.githubusercontent.com/4153982/40877297-e25b8054-667e-11e8-917c-81e61ca0601c.png">
<img width="706" alt="screen shot 2018-06-02 at 16 05 45" src="https://user-images.githubusercontent.com/4153982/40877302-f229c8ce-667e-11e8-8621-a74bf524cdc0.png">
