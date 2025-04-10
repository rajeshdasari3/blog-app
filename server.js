import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";


let posts = [{ id: 1, "title": "What is Node.js?", "content": "◼ Node.js is an open-source, cross-platform JavaScript runtime environment that allows developers to run JavaScript outside the browser.\n ◼ It is built on Google Chrome’s V8 JavaScript engine and is commonly used for backend development." }];

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve static files
app.set("view engine", "ejs"); // set EJS as templationg engine
app.use(methodOverride("_method")); // Enables PUT and DELETE via POST

// Home page displaying posts
app.get("/", (req, res) => {
    res.render("index", { posts });
})

// View a single post by ID
app.get("/view/:id", (req, res) => {
    const post = posts.find(p => (p.id == parseInt(req.params.id)));
    if (!post) return res.status(404).send("Post not found");
    res.render("view", { post });
})

// render form for creating a new post
app.get("/new", (req, res) => {
    res.render("new");
})

// Add new post
app.post("/add", (req, res) => {
    const { title, content } = req.body;
    posts.push({ id: Date.now(), title, content });
    res.redirect("/")
})

// Edit page - Lists posts with modify/delete options
app.get("/edit", (req, res) => {
    res.render("edit", { posts })
})

// Load edit form with specific post details
app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => (p.id === parseInt(req.params.id)));
    if (!post) return res.status(404).send("Post not found");
    res.render("modify", { post });
})

// Update an existing post
app.put("/update/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
        posts[index].title = req.body.title;
        posts[index].content = req.body.content;
        res.redirect("/");
    } else {
        return res.status(404).send("Post not found");
    }
})

// Delete post
app.delete("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
        res.redirect("/");
    } else {
        return res.status(404).send("Post not found");
    }
});

// catch all 404 route for undefined pages
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Start server
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})