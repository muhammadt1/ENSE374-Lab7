const bodyParser = require('body-parser');
const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express();

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.set("view engine", "ejs");

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true})); 


var user = [];
var userActive;
var taskActive = [];

app.get("/", function (req, res) {
    res.render("login");
});

app.get("/todo", function (req, res) {
    res.render("todo", {username: userActive, tasks: taskActive});
});

//--------------------------------------------------------------------------------
function userInfo()
{
    u = require('./public/users.json');
}

function userAdd()
{
    var fs = require('fs')
    fs.writeFile('./public/users.json', JSON.stringify(u), (err) => {
        if (err) console.log('Error writing file:', err);
    });
}

function userTask()
{
    taskActive = require('./public/tasks.json');
}

function add()
{
    var fs = require('fs')
    fs.writeFile('./public/tasks.json', JSON.stringify(taskActive), (err) => {
        if ( err )
        {
            console.log('Error writing file:', err);
        }
    });
}


//--------------------------------------------------------------------------------


app.post("/login", (req, res) => {
    userTask();
    userInfo();
    user = req.body["Email"];
    let p = req.body["Password"];

    const fs = require( "fs" );
    fs.readFile ( __dirname + "/public/users.json",
            "utf8", 
            ( err, jsonString ) => {
    if ( err ) 
    {
        console.log("Error reading file from disk:", err);
    }
    try 
    {
        const object = JSON.parse(jsonString);

        console.log( object); // entire users.json

        for(var i = 0; i < u.length; i++)
        {
            /*
            console.log("user: " + user);
            console.log("loginPassword: " + loginPassword);
            console.log("TrueEmail: " + object[i].username);
            console.log("TruePassword: " + object[i].password);
            */
            if(user == object[i].username && p == object[i].password)
            {   
                userActive = object[i].username;
                console.log("Success, redirecting");

                res.redirect("/todo");
            }
        }
        console.log("Failure, please try again");
        res.redirect("/");
    }
    catch ( err ) 
    {
        console.log("Error parsing JSON:", err);
    }
    });
});

app.post("/register", (req, res) => {
    userTask();
    userInfo();
    var isItTrue = 0;
    var registerUser = req.body["user2"];
    var registerPassword = req.body["psw2"];
    var registerAuth = req.body["auth"];

    if(registerAuth == "todo2022")
    {
        for(var i = 0; i < u.length; i++)
        {
            if(registerUser == u[i].username)
            {
                isItTrue = 1;
                res.redirect("/");
                break;
            }
        }
        if(isItTrue != 1)
        {
            u.push({"username": registerUser, "password": registerPassword});
            userActive = registerUser;
            userAdd();

            res.redirect("/todo");
        }
        isItTrue = 0;
    }
    else
    {
        res.redirect("/");
    }
});

app.get("/logout",(req,res)=>{
    userActive = null;
    res.redirect("/");
});


app.post("/addtask", (req, res) => {
    const uname = req.body["username"];
    const txt = req.body["task"];
    const size = taskActive.length + 1;

    // Create a new task object
    const newTask = 
    {
        "id": size,
        "text": txt,
        "state": "unclaimed",
        "creator": uname,
        "isTaskClaimed": false,
        "claimingUser": null,
        "isTaskDone": false,
        "isTaskCleared": false
    };

    taskActive.push(newTask);

    // Save changes to tasks.json
    add();

    res.redirect("/todo");
});

app.post("/claim", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; //add name to ejs remember
    const claim = taskActive.find(task => task.id === st);

    if (claim) 
    {
        claim.claimingUser = uname;
        claim.isTaskClaimed = false;
        claim.st = "unfinished";

        add();

        res.redirect("/todo");
    }
});


app.post("/abandon", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; // Change this to match the name in your EJS template
    const aband = taskActive.find(task => task.id === st);

    if (aband) {
        aband.claimingUser = null;
        aband.isTaskClaimed = false;
        aband.st = "unclaimed";

        // Assuming "add" is a function to save changes
        add();

        res.redirect("/todo");
    } 
});



app.post("/unfinish", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; // Change this to match the name in your EJS template
    const unfin = taskActive.find(task => task.id === st);

    if (unfin) 
    {
        unfin.isTaskDone = false;
        unfin.st = "unfinished";

        // Assuming "add" is a function to save changes
        add();

        res.redirect("/todo");
    } 
});

app.post("/purge", (req, res) => {
    const uname = req.body["username"];

    for (let i = 0; i < taskActive.length; i++) 
    {
        if (taskActive[i].isTaskDone === true) 
        {
            taskActive[i].isTaskCleared = true;
        }
    }

    // Assuming "add" is a function to save changes
    add();

    res.redirect("/todo");
});

app.post("/finish", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; // Change this to match the name in your EJS template
    const taskToFinish = taskActive.find(task => task.id === st);

    if (taskToFinish) 
    {
        taskToFinish.isTaskDone = true;
        taskToFinish.st = "finished";

        // Assuming "add" is a function to save changes
        add();

        res.redirect("/todo");
    } 
});

