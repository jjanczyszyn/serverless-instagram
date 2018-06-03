let AuthStorage = {
    store: function(token, profile){
        localStorage.setItem('token', token);
        localStorage.setItem('profile', JSON.stringify(profile, null, 4));
    },
    retrieve: function(){
        let result = {
            token: null,
            profile: null,
            profileJson: null
        };
        let token = localStorage.getItem('token');
        let profileJson = localStorage.getItem('profile');
        if (token) {
            result.token = token;
        }
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

                auth0Lock.show(options, function (err, profile, token) {
                    if (err) {
                        let message = ['Failed to show auth0 dialog:', err + ''].join(' ');
                        UI.showError(message);
                        return;
                    } else {
                        AuthStorage.store(token, profile);
                        UI.UserProfile.toggle(profile);
                    }
                });

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
                UI.ProfileButton.toggle(false);
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
            $("#user-profile").click(function (event) {
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
            let showAuthenticationElements = !!profile;
            if (showAuthenticationElements) {
                $('#profilename').text(profile.nickname);
                $('#profilepicture').attr('src', profile.picture);
            }

            UI.LoginButton.toggle(!showAuthenticationElements);
            UI.LogoutButton.toggle(showAuthenticationElements);
            UI.ProfileButton.toggle(showAuthenticationElements);
            $("#user-profile-jumbotron").toggle(showAuthenticationElements);
        },
    },
};

let application = {
    config: null,
    init: function (config) {
        let user = AuthStorage.retrieve();
        new ClipboardJS('#clippy', {
            container: document.getElementById('user-profile-modal')
        });

        this.config = config;
        this.lock = new Auth0Lock(
            config.auth0.clientId,
            config.auth0.domain
        );
        this.wireEvents();
        UI.UserProfile.toggle(user.profile);
    },
    wireEvents: function () {
        UI.LoginButton.bindEvents(this.lock);
        UI.LogoutButton.bindEvents();
        UI.ProfileButton.bindEvents();
    }
};
