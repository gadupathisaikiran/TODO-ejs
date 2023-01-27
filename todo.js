const express = require("express");

const app = express();
const TodoTask = require("./TODO-ejs/Model/model");
const mongoose = require("mongoose");
const dotenv = require("dotenv");



dotenv.config();

//connection to db


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!")
    app.listen(3000, () => console.log("Server Up and running"))
})


app.set("view engine", "ejs")



app.use(express.urlencoded({ extended: true }))


// get

app.get("/", async (req, res) => {
   TodoTask.find({},(err, tasks) => {
        res.render("todo.ejs",{ todoTasks: tasks })
    })
})


// post
app.post('/', async (req,res) => {
    console.log(req.body)
    const todoTask = TodoTask.create({
        content: req.body.content
    })
    try {
        res.redirect("/")
        
    } catch (err) {
        res.redirect("/")
    }
})

// update


app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });






//DELETE

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});





app.listen(5000, () => console.log("Server Up and running"));