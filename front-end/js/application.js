let AuthStorage = {
    store: function(token, profile){
        localStorage.setItem('token', token);
        localStorage.setItem('profile', JSON.stringify(profile, null, 4));
    },
    retrieve: function(){
        let result = {};
        let token = localStorage.getItem('token');
        let profileJson = localStorage.getItem('profile');
        if (token) {
            result.token = token;
        } else { return; }
        if (profileJson) {
            result.profileJson = profileJson;
            result.profile = JSON.parse(profileJson);
        }
        return result;
    },
    clear: function(){
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
    }
};

let UI = {
    showError: function(message) {
        alert(message);
    },
    LoginButton: {
        toggle: function(condition) {
            $('#auth0-login').toggle(condition);
            return this;
        },
        bindEvents: function(auth0Lock){
            $('#auth0-login').click(function (event) {
                let options = {
                    authParams: {
                        scope: 'openid email user_metadata picture'
                    }
                };
                auth0Lock.show(options);

                return event.preventDefault();
            });

        }
    },
    LogoutButton: {
        toggle: function(condition) {
            $('#auth0-logout').toggle(condition);
            return this;
        },
        bindEvents: function(){
            $('#auth0-logout').on('click', function(event) {
                AuthStorage.clear();

                UI.LoginButton.toggle(true);

                UI.LogoutButton.toggle(false);
                UI.UploadButton.toggle(false);
                UI.ProfileButton.toggle(false);
                UI.Gallery.hide();
                return event.preventDefault();
            });
        }
    },
    ProfileButton: {
        toggle: function(condition) {
            $('#user-profile').toggle(condition);
            return this;
        },
        bindEvents: function(){
            $('#user-profile').click(function (event) {
                let data = AuthStorage.retrieve();
                $('#user-profile-raw-json').text(data.profileJson);
                $('#user-token').text(data.token);
                $('#user-profile-modal').modal();

                return event.preventDefault();
            });
        }
    },
    UserProfile: {
        toggle: function(profile){
            let authenticated = !!profile;
            if (authenticated) {
                $('#profilename').text(profile.nickname);
                $('#profilepicture').attr('src', profile.picture);
            }

            UI.LoginButton.toggle(!authenticated);
            UI.LogoutButton.toggle(authenticated);
            UI.UploadButton.toggle(authenticated);
            UI.ProfileButton.toggle(authenticated);
            $('#user-profile-jumbotron').toggle(authenticated);
        },
    },
    UploadButton: {
        toggle: function(condition){
            $('#upload-image-button').toggle(condition);
            return this;
        },
        bindEvents: function(onFileSelected){
            $('#upload-image-button').on('click', function (event) {
                $('#upload').trigger('click');
                return event.preventDefault();
            });

            $('#upload').on('change', function (event) {
                let file = $('#upload').get(0).files[0];
                let fileSizeMB = Math.round(100 * file.size / (1024 * 1024)) / 100;
                if(fileSizeMB > 1){
                    let message = [
                        'File cannot be greater than 1MB!',
                        'The file uploaded:',
                        ' + fileSizeMB + '
                    ].join(' ');

                    UI.showError(message);
                } else {
                    onFileSelected(file);
                }
            });
        }
    },
    Image: {
        add: function(data) {
            let info = ImageCardHelper.extractInformation(data);
            $card = ImageCardHelper.render(info.url, info.description);
            UI.Gallery.add($card);
            return this;
        }
    },
    Gallery: {
        hide: function(){
            $('#image-list').hide();
            return this;
        },
        add: function($card) {
            $('#image-list').append($card);
            return this;
        },
        clear: function() {
            $('#image-list').empty();
            return this;
        }
    },
    UploadProgress: {
        show: function(){
            $('#upload-progress').show();
            return this;
        },
        hide: function(){
            $('#upload-progress').hide();
            return this;
        },
        reset: function() {
            return this.update(0)
        },
        update: function(percentage) {
            $('#upload-progress').find('.progress-bar').css('width', percentage + '%');
            return this;
        }
    }
};

let ImageCardHelper = {
    render: function(url, description){
        let $new = $('#image-template').clone().attr({
            'id': url,
        }).show();

        $new.find('img').attr('src', url).show();
        $new.find('.metadata').text(description);
        return $new;
    },
    extractInformation(data) {
        /** prepare image information **/

        // parse date from unix timestamp
        let uploadDate = moment(data.createdAt, 'x');

        // extract username from email
        let username = data.user.split('@', 1)[0];

        // generate a description
        let description = [uploadDate.fromNow(), 'by', username].join(' ');

        // return the final result
        let result = {
            url: data.image,
            description: description
        };
        return result;
    }
};

let HttpRequest = {
    handleProgress: function(evt) {
        let percentage = evt.loaded / evt.total * 100;
        UI.UploadProgress.update(percentage);
    },
    factory: function() {
        let xhr = $.ajaxSettings.xhr();
        xhr.addEventListener('progress', HttpRequest.handleProgress);
        xhr.upload.addEventListener('progress', HttpRequest.handleProgress);
        return xhr;
    }
};

let S3 = {
    uploadImage: function(signedUrl, file) {
        return $.ajax({
            url: signedUrl,
            type: 'PUT',
            data: file,
            processData: false,
            contentType: file.type,
            beforeSend: function(xhr) {
            },
            xhr: HttpRequest.factory,
        })
    }
};

let Lambda = {
    getSignedS3Url: function(url, accessToken) {
        return $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function(xhr) {
                let bearer = ['Bearer', accessToken].join(' ');
                xhr.setRequestHeader('Authorization', bearer);
            }
        })

    },
    getImageListFromDynamoDB: function(url, accessToken){
        return $.ajax({
            url: url,
            type: 'GET',
            processData: false,
            beforeSend: function(xhr) {
                let bearer = ['Bearer', accessToken].join(' ');
                xhr.setRequestHeader('Authorization', bearer);
            }
        })
    }
};

let application = {
    config: null,
    init: function (config) {
        this.config = config;
        this.lock = new Auth0Lock(
            config.auth0.clientId,
            config.auth0.domain
        );
        this.lock.on("authenticated", function(authResult) {
            application.lock.getUserInfo(authResult.accessToken, function(error, profile) {
              if (error) {
                let message = ['Failed to show auth0 dialog:', error + ''].join(' ');
                UI.showError(message);
                return;
              }
              // Save token and profile locally
              AuthStorage.store(authResult.idToken, profile);
              application.wireProfile(profile);
            });
        });
        this.wireEvents();
        let user = AuthStorage.retrieve();
        if(user){
            this.wireProfile(user.profile);
        }
        new ClipboardJS('#clippy', {
            container: document.getElementById('user-profile-modal')
        });
    },
    wireProfile: function (profile) {
        this.fetchFromDynamoDB();
        UI.UserProfile.toggle(profile);
    },
    wireEvents: function () {
        UI.LoginButton.bindEvents(this.lock);
        UI.LogoutButton.bindEvents();
        UI.ProfileButton.bindEvents();
        UI.UploadButton.bindEvents(function(file){
            let url = this.config.apiBaseUrl + '/get_signed_url?content_type='+ encodeURI(file.type);
            let token = localStorage.getItem('token');
            Lambda.getSignedS3Url(url, token).then(function(data, textStatus){
                this.upload(file, data);
            }.bind(this));
        }.bind(this));
    },
    upload: function (file, data) {
        UI.UploadProgress.show().reset();

        S3.uploadImage(data.url, file).then(function(data, textStatus){
            UI.UploadProgress.hide();

            switch (textStatus) {
                case 'success':
                    setTimeout(function(){
                        this.fetchFromDynamoDB();
                    }.bind(this), 5000);
                    break;
                case 'error':
                case 'timeout':
                case 'parsererror':
                case 'abort':
                default:
                    UI.showError('failed to upload');
                    break;
            }
        }.bind(this));
    },
    fetchFromDynamoDB: function () {
        let url = this.config.apiBaseUrl + '/list_images';
        let token = localStorage.getItem('token');

        Lambda.getImageListFromDynamoDB(url, token).then(function (images, status) {
            UI.Gallery.clear();
            $.each(images, function(index, data) {
                UI.Image.add(data);
            });
        });
    }
};
