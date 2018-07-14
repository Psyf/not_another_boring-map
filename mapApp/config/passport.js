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
				// by default, local strategy uses username and password, we will override with email
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
			},
			function(req, email, password, done) {
				// asynchronous
				process.nextTick(function() {
					//  Whether we're signing up or connecting an account, we'll need
					//  to know if the email address is in use.
					User.findOne({ "local.email": email }, function(
						err,
						existingUser
					) {
						// if there are any errors, return the error
						if (err) return done(err);

						// check to see if there's already a user with that email
						if (existingUser)
							return done(
								null,
								false,
								req.flash(
									"signupMessage",
									"That email is already taken."
								)
							);

						//  If we're logged in, we're connecting a new local account.
						if (req.user) {
							var user = req.user;
							user.local.email = email;
							user.local.password = user.generateHash(password);
							user.save(function(err) {
								if (err) throw err;
								return done(null, user);
							});
						}
						//  We're not logged in, so we're creating a brand new user.
						else {
							// create the user
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
				profileFields: ["id", "emails", "name"],
				passReqToCallback: true
			},
			function(req, token, refreshToken, profile, done) {
				process.nextTick(function() {
					if (!req.user) {
						User.findOne({ "facebook.id": profile.id }, function(
							err,
							user
						) {
							if (err) return done(err);
							if (user) {
								// if there is a user id already but no token (user was linked at one point and then removed)
								// just add our token and profile information
								if (!user.facebook.token) {
									user.facebook.token = token;
									user.facebook.name =
										profile.name.givenName +
										" " +
										profile.name.familyName;
									user.facebook.email =
										profile.emails[0].value;

									user.save(function(err) {
										if (err) throw err;
										return done(null, user);
									});
								}

								return done(null, user); // user found, return that user
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
					} else {
						var user = req.user; // pull the user out of the session
						// update the current users facebook credentials
						user.facebook.id = profile.id;
						user.facebook.token = token;
						user.facebook.name =
							profile.name.givenName +
							" " +
							profile.name.familyName;
						user.facebook.email = profile.emails[0].value || null;

						// save the user
						user.save(function(err) {
							if (err) throw err;
							return done(null, user);
						});
					}
				});
			}
		)
	);

	passport.use(
		new GoogleStrategy(
			{
				clientID: configAuth.googleAuth.clientID,
				clientSecret: configAuth.googleAuth.clientSecret,
				callbackURL: configAuth.googleAuth.callbackURL,
				passReqToCallback: true
			},
			function(req, token, refreshToken, profile, done) {
				process.nextTick(function() {
					if (!req.user) {
						User.findOne({ "google.id": profile.id }, function(
							err,
							user
						) {
							if (err) return done(err);
							if (user) {
								// if there is a user id already but no token (user was linked at one point and then removed)
								// just add our token and profile information
								if (!user.google.token) {
									user.google.token = token;
									user.google.name =
										profile.name.givenName +
										" " +
										profile.name.familyName;
									user.google.email = profile.emails[0].value;

									user.save(function(err) {
										if (err) throw err;
										return done(null, user);
									});
								}

								return done(null, user); // user found, return that user
							} else {
								var newUser = new User();
								newUser.google.id = profile.id;
								newUser.google.token = token;
								newUser.google.name =
									profile.name.givenName +
									" " +
									profile.name.familyname;
								newUser.google.email =
									profile.emails[0].value || null;

								newUser.save(function(err) {
									if (err) throw err;

									return done(null, newUser);
								});
							}
						});
					} else {
						var user = req.user; // pull the user out of the session
						// update the current users google credentials
						user.google.id = profile.id;
						user.google.token = token;
						user.google.name =
							profile.name.givenName +
							" " +
							profile.name.familyName;
						user.google.email = profile.emails[0].value || null;

						// save the user
						user.save(function(err) {
							if (err) throw err;
							return done(null, user);
						});
					}
				});
			}
		)
	);
};
