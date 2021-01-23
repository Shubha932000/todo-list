//const path= require('path')
require("dotenv");
const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const pool = require("./db_config");

//var { pool } = require('./db_config')
console.log('process.env')

app.get("/add", (req, res) => {
    res.json({ "taskname": "abc" });
})

app.post("/ad", (req, res) => {
    let name = req.body.name;
    res.send(name);
})

app.post("/", async(req, res) => {
    let task = req.body.task;
    if (task) {
        let sql = "INSERT INTO todo(taskname) VALUES (?)";
        let result = await pool.query(sql, [task]);
        let task_id = result.insertId;
        res.status(200).json({
            message: "Task Added",
            taskId: task_id,
        });
    } else {
        res.status(400).json({
            message: "Missing Required Field",
        });
    }
});

app.delete("/:id", async(req, res) => {
    let task_id = req.params.id;
    if (task_id) {
        let sql = "DELETE FROM todo WHERE id=?";
        let result = await pool.query(sql, [task_id]);
        res.status(200).json({
            message: "Task Deleted",
        });
    } else {
        res.status(400).json({
            message: "Missing Required Field",
        });
    }
})

app.put("/:id", async(req, res) => {
    let task_id = req.params.id;
    let task_name = req.body.task;
    if (task_id && task_name) {
        let check_sql = "SELECT * FROM todo WHERE id=?";
        let [check_result] = await pool.query(check_sql, [task_id]);
        if (check_result) {
            let sql = "UPDATE todo set taskname=? WHERE id=?";
            let result = await pool.query(sql, [task_name, task_id]);
            res.status(200).json({
                message: "Task Edited",
            });
        } else {
            res.status(400).json({
                message: "Task Doesn't Exist",
            });
        }
    } else {
        res.status(400).json({
            message: "Missing Required Field",
        });
    }
})

//const { addtask, gettask, deletetask } = require("./controller/event");
//app.get("/", gettask);
//app.post("/", addtask);
//app.delete("/:id", deletetask);

app.listen(PORT, async() => { console.log("Server Started @" + PORT) });