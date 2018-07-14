const LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../models/user");

var configAuth = require("./auth");

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				process.nextTick(function() {
					User.findOne({ "local.email": email }, function(err, user) {
						if (err) return done(err);
						if (user) {
							return done(
								null,
								false,
								req.flash(
									"signupMessage",
									"This email is already taken."
								)
							);
						} else {
							var newUser = new User();
							newUser.local.email = email;
							newUser.local.password = newUser.generateHash(
								password
							);

							newUser.save(function(err) {
								if (err) throw err;
								return done(null, newUser);
							});
						}
					});
				});
			}
		)
	);

	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				User.findOne({ "local.email": email }, function(err, user) {
					if (err) return done(err);
					if (!user)
						return done(
							null,
							false,
							req.flash(
								"loginMessage",
								"Username/Password invalid"
							)
						);
					if (!user.validPassword(password))
						return done(
							null,
							false,
							req.flash(
								"loginMessage",
								"Username/Password invalid"
							)
						);
					return done(null, user);
				});
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: configAuth.facebookAuth.clientID,
				clientSecret: configAuth.facebookAuth.clientSecret,
				callbackURL: configAuth.facebookAuth.callbackURL,
				profileFields: ["id", "emails", "name"]
			},
			function(token, refreshToken, profile, done) {
				process.nextTick(function() {
					User.findOne({ "facebook.id": profile.id }, function(
						err,
						user
					) {
						if (err) return done(err);
						if (user) {
							return done(null, user);
						} else {
							var newUser = new User();
							newUser.facebook.id = profile.id;
							newUser.facebook.token = token;
							newUser.facebook.name =
								profile.name.givenName +
								" " +
								profile.name.familyname;
							newUser.facebook.email =
								profile.emails[0].value || null;

							newUser.save(function(err) {
								if (err) throw err;

								return done(null, newUser);
							});
						}
					});
				});
			}
		)
	);

	 passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
