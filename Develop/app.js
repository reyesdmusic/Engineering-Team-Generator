const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const joi = require("joi");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const tomEngineer = new Engineer("Tom", "55", "tom@gmail.com", "tom@github.io");
const calManager = new Manager("Cal", "22", "Cal@gmail.com", "88");
const kimIntern = new Intern("Kim", "92", "kim@gmail", "FIU");


const employeeArray = [tomEngineer, calManager, kimIntern];

const basicQuestionsByRole = (role) => {

    const basicQuestionsArray = [`Enter ${role}'s name:`, `Enter ${role} ID (must be a number):`, `Enter ${role} Email:`];

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: basicQuestionsArray[0],
            validate: validateString
        },
        {
            type: "input",
            name: "id",
            message: basicQuestionsArray[1],
            validate: validateNumber
        
        },
        {
            type: "input",
            name: "email",
            message: basicQuestionsArray[2],
            validate: validateEmail
        }

    ])
    
}


const newManager = () => {

    basicQuestionsByRole("Manager")
    
    .then(response => {
        const newManager = new Manager(response.name, response.id, response.email);
    });
    
}

const nextQuestion = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: basicQuestionsArray[0],
            validate: validateString
        },
        {
            type: "input",
            name: "id",
            message: basicQuestionsArray[1],
            validate: validateNumber
        
        },
        {
            type: "input",
            name: "email",
            message: basicQuestionsArray[2],
            validate: validateEmail
        }

    ])
}



const printFile = () => {

    const thisNewTeam = render(employeeArray);


    fs.writeFile(outputPath, thisNewTeam, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("Success!");
        }
    });
}



function validateNumber(name) {
   let schema = joi.number().required();
   return joi.validate(name, schema, onValidation)
}

function validateEmail(name) {
    return joi.validate(name, joi.string().email(), onValidation);
}

function onValidation(err, val){
    if(err) {
        return err.message;
    }
    else {
        return true;
    }
}

function validateString(name) {
    var schema = joi.string().required();
    return joi.validate(name, schema, onValidation);
}


newManager();



