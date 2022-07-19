const passport = require("passport");
const localstrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");

passport.use("local.signin", new localstrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async(req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query( "SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validpassword = await helpers.matchpassword(password, user.password);
        if (validpassword) {
            done(null, user, req.flash("success", "Bienvenido" + user.username));
        } else {
            done(null, false, req.flash("message", "Contraseña incorrecta, intentá de nuevo"));
        }
    } else {
        return done(null, false, req.flash("message", "Este usuario no existe"));
    }
}));

passport.use("local.signup", new localstrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newuser = {
        username,
        password,
        fullname
    };
    newuser.password = await helpers.encryptpassword(password);
    const result = await pool.query("INSERT INTO users SET ?", [newuser]);
    newuser.id = result.insertId;
    return done(null, newuser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
});