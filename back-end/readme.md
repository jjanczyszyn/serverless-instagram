## Adding image metadata

1. Add **_IMAGE_INFO_TABLE_NAME_* to your config.json like in [the example config](config.json.example).
2. Run `sls deploy`.
3. On your website upload an image.
4. Run `sls logs -f addImageInfo` (You can get a personalized event from the displayed logs or use the one provided)
5. Run `sls invoke -f addImageInfo -p event.json`
