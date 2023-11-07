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

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}));


app.get("/", (req, res) => 
{
    res.sendFile(__dirname + "/public/index.html")
    console.log("A user requested the about page");
});


//When a user accesses/submits the form 
app.post("/", (req, res) => {

    //Email & Password for field from html file. (login accordion )
    var eInp = req.body["Email"], pInp = req.body["Password"];

    
    const fs = require("fs");
    
    //Read contents from json file (username and password)
    fs.readFile ( __dirname + "/public/users.json",
            "utf8", 
            ( err, jsonString ) => {
    if ( err ) {
        console.log("Error reading file from disk:", err);
        return res.redirect("/");
    }
    try 
    {
        //Analyzing data from said file
        const object = JSON.parse(jsonString);

        console.log("The Email user entered is: " , eInp);
        console.log("The Password user entered is: " , pInp);

        //To reveal the info in json
        /* 
        console.log("Email is:", object.username); 
        console.log("Password is:", object.password);
        */

        //checks if data matches json file
        if(eInp === object.username && pInp === object.password)
        {
            console.log("Success, redirecting");
            res.sendFile(__dirname + "/public/list.html");
        }
        else
        {
            console.log("Failure, please try again")
        }
    } 
    catch ( err ) 
    {
        console.log("Error parsing JSON:", err);
    }
  });
});
