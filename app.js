var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// passport
var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

app.use('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tracker');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    title: String,
    user: String,
    priority: Number,
    status: String,
    spendtime: Number,
    velocity: Number,
    date: {type: Date, default: Date.now}
});

var Task = mongoose.model('Task', TaskSchema);

var form = require("express-form"),
    field = form.field;

var TaskForm = form(
    field("title").trim().required()
);


app.get('/api/tasks', function (req, res) {
    Task.find(function (err, tasks) {
        res.json(tasks);
    })
});

app.post('/api/tasks', TaskForm, function (req, res) {


    if (req.form.isValid) {
        var task = new Task(req.form);
        task.save(function (err, task) {
            res.json(task);
        });
    }
    else {
        res.sendStatus(400);
    }

});

app.param('taskId', function (req, res, next, taskId) {

    Task.findById(taskId, function (err, task) {
        req.Task = task;
        next();
    });
});

app.delete('/api/tasks/:taskId', function (req, res) {

    req.Task.remove(function () {
        res.sendStatus(200);
    });

});

app.put('/api/tasks/:taskId', TaskForm, function (req, res) {

    var task = req.Task;

    if (req.form.isValid) {
        task.title = req.form.title;

        task.save(function (err, task) {
            res.json(task);
        });
    }
    else {
        res.sendStatus(400);
    }

});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Tracker app listening at http://%s:%s', host, port)

});