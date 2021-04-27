const chalk = require("chalk");
const yargs = require("yargs");
const notes = require("./notes.js");

//Customize yargs verison
yargs.version("1.1.0");

//Create add command
yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
        body: {
            describe: "This is the body",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {notes.addNote(argv.title, argv.body)}
    });

//Create Remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: "Note that we want to remove",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {notes.removeNotes(argv.title)}
});

//Create list command
yargs.command({
    command: "list",
    describe: "List a note",
    handler(argv) {notes.listNotes(argv.title)}
});

//Create Read command
yargs.command({
    command: "read",
    describe: "Reading a note",
    builder: {
        title: {
            describe: "Reading a title",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {notes.readNotes(argv.title)}
});

yargs.parse();
