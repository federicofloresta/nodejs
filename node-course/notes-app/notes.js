const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateNote = notes.find((note) => notes.title === title) 

    if (!duplicateNote) {
        notes.push({
            title: title,
            body: body
        })
        savedNotes(notes)
        console.log(chalk.bgGreen("New note added!"))
    } else {
        console.log(chalk.bgRed("Already found the same note"))
    }
};

const removeNotes = (title) => {
    const notes = loadNotes() // reading data from our file; this is the original array 
  /*this is our new array */  const notesToKeep = notes.filter((note) => note.title !== title) // if the two titles match, then we will delete
    if (notes.length > notesToKeep.length) {
        console.log(chalk.bgGreen("Note removed!"))
        savedNotes(notesToKeep)// this will save the new array
    } else {
        console.log(chalk.bgRed("No note found!"))
    }
};

const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.bgWhite.blue("Your notes"))
    notes.forEach((note) => {
        console.log(note.title)
    })
};

const readNotes = (title) => {
   const notes = loadNotes()
    const readNote = notes.find((note) => note.title === title)
    if (readNote) {
        console.log(chalk.bold(readNote.title))
        console.log(readNote.body)
    } else {
        console.log(chalk.red("No note has been found with that title!"))
    }
}; 

const savedNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync("notes.json", dataJSON)
};
    
const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync("notes.json")
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
};

module.exports = {
    addNote: addNote,
    removeNotes: removeNotes,
    listNotes: listNotes,
    readNotes: readNotes
};
