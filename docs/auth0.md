create auth0 account: https://auth0.com/

* You’ll be asked to enter an tenant domain. Enter a name that is unique to you, e.g. your-name-and-surname.auth0.com
* Enter “US” as your region.

<img width="522" alt="screen shot 2018-02-11 at 09 39 56" src="https://user-images.githubusercontent.com/4153982/36074816-9faabf8a-0f13-11e8-9188-1076c5b618a2.png">

* Click Next and fill out the information on the next page.

<img width="546" alt="screen shot 2018-02-11 at 09 40 11" src="https://user-images.githubusercontent.com/4153982/36074817-a0fc42f0-0f13-11e8-9363-1e9983c1d45d.png">

* Click Create Account.
* Go to Clients in the left navigation menu, and click on the Default App.
* Go to Connections in the Default App menu, and make sure that only Username-Password-Authentication is enabled.

<img width="1090" alt="screen shot 2018-02-11 at 10 01 34" src="https://user-images.githubusercontent.com/4153982/36074818-a534ee1c-0f13-11e8-9156-85e3823d934e.png">

* Go to Settings in the Default App menu.
* Scroll down until you find the textbox called Allowed Origins (CORS).
* Enter the following value in the textbox: http://localhost:8100

<img width="870" alt="screen shot 2018-02-11 at 10 03 07" src="https://user-images.githubusercontent.com/4153982/36074821-a844bb82-0f13-11e8-8325-3ff00e016e6d.png">

* Scroll down and click the Save Changes button.

<img width="1082" alt="screen shot 2018-02-11 at 10 03 28" src="https://user-images.githubusercontent.com/4153982/36074822-aa80f2da-0f13-11e8-8e95-0ffb44018ef7.png">

* Under Advanced Settings, choose the OAuth menu, and change JsonWebToken Signature Algorithm from RS256 to HS256.
* In the same section, disable the OIDC Conformant option.

<img width="1054" alt="screen shot 2018-02-11 at 10 03 55" src="https://user-images.githubusercontent.com/4153982/36074824-ae582392-0f13-11e8-9e9a-a650778424e1.png">

* We now need to retrieve some values from Auth0 that will be needed throughout this workshop. 
Scroll up to the top of the same Settings page, and find the Domain, Client ID and Client Secret.

<img width="862" alt="screen shot 2018-02-11 at 10 05 01" src="https://user-images.githubusercontent.com/4153982/36074826-b161617a-0f13-11e8-82b2-c753a30524cb.png">

* Using the values retrieved above, fill AUTH0_DOMAIN, AUTH0_SECRET,AUTH0_CLIENT_ID in your `backend\config.json` and  domain and clientId in your `website\js\config.js`
