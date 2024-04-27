const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html and it's "url"
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.route("/api/notes")
    // Grab the notes list 
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        
        let highestId = 99;
        
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        
        database.push(newNote)

        // Write the db.json 
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response, which is the user's new note
        res.json(newNote);
    });


app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // request to delete note by id
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
           
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file 
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});