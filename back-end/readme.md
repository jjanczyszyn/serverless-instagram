## Image Upload

1. Copy previous configuration file to the current directory `cp ../1-authorization/config.json .` and add **_UPLOAD_IMAGE_BUCKET_NAME_** like in [the example config](config.json.example). (note: s3 bucket names need to be unique across all AWS! To avoid conflicts use something like: "serverless-instagram-\<your name>")
2. Run `sls deploy`.
3. Run `sls invoke -f authorizer -p event.json`


<img width="672" alt="screen shot 2018-06-02 at 15 33 52" src="https://user-images.githubusercontent.com/4153982/40877297-e25b8054-667e-11e8-917c-81e61ca0601c.png">
<img width="706" alt="screen shot 2018-06-02 at 16 05 45" src="https://user-images.githubusercontent.com/4153982/40877302-f229c8ce-667e-11e8-8621-a74bf524cdc0.png">
