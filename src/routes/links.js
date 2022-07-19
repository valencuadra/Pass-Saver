const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isloggedin, isnotloggedin } = require("../lib/auth");

router.get("/add", isloggedin, (req, res) => {
    res.render("links/add");
});

router.post("/add", isloggedin, async (req, res) => {
    const { title, url, description } = req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query("INSERT INTO links set ?", [newlink]);
    req.flash("success", "Link guardado exitosamente");
    res.redirect("/links");
});

router.get("/", isloggedin, async (req, res) => {
    const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [req.user.id]);
    res.render("links/list", {links: links});
});

router.get("/delete/:id", isloggedin, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM links WHERE ID = ?", [id]);
    req.flash("success", "Enlace removido con éxito");
    res.redirect("/links");
});

router.get("/edit/:id", isloggedin, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
    res.render("links/edit", {link: links[0]});
});

router.post("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body;
    const newlink = {
        title,
        description,
        url
    };
    await pool.query("UPDATE links set ? WHERE id = ?", [newlink, id]);
    req.flash("success", "Link actualizado con exito");
    res.redirect("/links");
});

module.exports = router;