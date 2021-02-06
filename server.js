const http = require('http')
const fs = require('fs')
const path = require('path')
const express = require('express')
const { json } = require('express')
const app = express()
const PORT = process.env.PORT|| 8080 ;
const { v4: uuidv4 } = require('uuid');



// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))
//look at public to serve up static files



app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
})
app.get('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    res.json(JSON.parse(data))
  });
})




//post a note


app.post('/api/notes', (req, res) => {

  const newNote = req.body
  newNote.id = uuidv4();



  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    const updatedData = JSON.parse(data).concat(newNote)

    fs.writeFile('./db/db.json', JSON.stringify(updatedData), (err, data) => {
      res.json({ "name": "true" })
    })
  })
})



app.delete("/api/notes/:id", (req, res) => {
  let removeId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    const updatedData = JSON.parse(data)



    const result = updatedData.filter(note => note.id != removeId);

    JSON.stringify(result)


    fs.writeFile('./db/db.json', JSON.stringify(result), (err, data) => {
      res.json({ "name": "true" })
    })
  })


})


app.get('*', (req, res) => {
  console.log("index.html2")
  res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.listen(PORT, function () {
  console.log(`Server listening on http://localhost:${PORT}`)
});
