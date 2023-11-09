const bodyParser = require('body-parser');
const express = require ( "express" );
const fs = require( "fs" );


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


let u= [];
let taskActive = [];
var userActive = null;



app.get("/", function (req, res) {
    res.render("index");
});

app.get("/todo", function (req, res) {
    userTask();
    res.render("todo", { username: userActive, tasks: taskActive });
});

//--------------------------------------------------------------------------------


function userAdd()
{
    var fs = require('fs')
    fs.writeFile('./public/users.json', JSON.stringify(u), (err) => {
        if (err) console.log('Error writing file:', err);
    });
}

function userTask() {
    // Initialize taskActive with an empty array in case tasks.json doesn't exist
    try {
        taskActive = require('./public/tasks.json');
    } catch (error) {
        taskActive = [];
    }
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
    u= req.body["Email"];
    let p = req.body["Password"];

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

        for(var i = 0; i < u.length; i++)
        {
            /*
            console.log("Username is:", object[i].username); 
            console.log("Password is:", object[i].password);
            */
            if(u== object[i].username && p == object[i].password)
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
    const userReg = req.body["EmailSign"];
    const passReg = req.body["PasswordSign"];
    const authReg = req.body["Authentication"];

    if (authReg === "auth") {
        userTask();
        let realUser = false;

        // Check if a user with the same username already exists
        for (let i = 0; i < u.length; i++) 
        {
            if (userReg === u[i].username) 
            {
                realUser = true;
                break;
            }
        }

        if (realUser != true) {
            // Create a new user with the provided username and password
            u.push({ "username": userReg, "password": passReg });

            // Save the updated user list to the JSON file
            userAdd();

            // Set the active user
            userActive = userReg;

            // Redirect to the "/todo" route
            res.redirect("/todo");
        } else {
            // User with the same username exists, redirect back to the registration page
            res.redirect("/");
        }
    } else {
        // Authorization field does not match, redirect back to the registration page
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

    add(); // Save changes to tasks.json

    res.redirect("/todo");
});

app.post("/claim", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; //add name to ejs remember
    const t = taskActive.find(t => t.id === st);

    if (t) 
    {
        t.claimingUser = uname;
        t.isTaskClaimed = false;
        t.st = "unfinished";

        add();

        res.redirect("/todo");
    }
});


app.post("/abandon", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; // Change this to match the name in your EJS template
    const t = taskActive.find(t => t.id === st);

    if (t) {
        t.claimingUser = null;
        t.isTaskClaimed = false;
        t.st = "unclaimed";

        // Assuming "add" is a function to save changes
        add();

        res.redirect("/todo");
    } 
});



app.post("/unfinish", (req, res) => {
    const uname = req.body["username"];
    const st = req.body["state"]; // Change this to match the name in your EJS template
    const t = taskActive.find(t => t.id === st);

    if (t) 
    {
        t.isTaskDone = false;
        t.st = "unfinished";

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
    const t = taskActive.find(t => t.id === st);

    if (t) 
    {
        t.isTaskDone = true;
        t.st = "finished";

        // Assuming "add" is a function to save changes
        add();

        res.redirect("/todo");
    } 
});

