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


const employeeArray = [];


const newManager = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter manager's name:",
            validate: validateString
        },
        {
            type: "input",
            name: "id",
            message: "Enter manager's ID (must be a number):",
            validate: validateNumber
        
        },
        {
            type: "input",
            name: "email",
            message: "Enter manager's email:",
            validate: validateEmail
        },

        {
            type: "input",
            name: "officeNumber",
            message: "Enter manager's office number:",
            validate: validateString
        }



    ])
    
    .then(response => {
        const newManager = new Manager(response.name, response.id, response.email, response.officeNumber);

        employeeArray.push(newManager);

        nextQuestion();
    });
    
}

const newEngineer = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter engineer's name:",
            validate: validateString
        },
        {
            type: "input",
            name: "id",
            message: "Enter engineer's ID (must be a number):",
            validate: validateNumber
        
        },
        {
            type: "input",
            name: "email",
            message: "Enter engineer's email:",
            validate: validateEmail
        },

        {
            type: "input",
            name: "github",
            message: "Enter engineer's Github username:",
            validate: validateString
        }

    ])
    
    .then(response => {
        const newEngineer = new Engineer(response.name, response.id, response.email, response.github);

        employeeArray.push(newEngineer);

        nextQuestion();
    });
    
}

const newIntern = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter intern's name:",
            validate: validateString
        },
        {
            type: "input",
            name: "id",
            message: "Enter intern's ID (must be a number):",
            validate: validateNumber
        
        },
        {
            type: "input",
            name: "email",
            message: "Enter intern's email:",
            validate: validateEmail
        },

        {
            type: "input",
            name: "school",
            message: "Enter interns's school:",
            validate: validateString
        }


    ])
    
    .then(response => {
        const newIntern = new Intern(response.name, response.id, response.email, response.school);

        employeeArray.push(newIntern);

        nextQuestion();
    });
    
}


const nextQuestion = () => {

    inquirer.prompt([   
    {
        type: "confirm",
        name: "newMember",
        message: "Would you like to add another team member?",
    }
])

.then(response => {
    if (response.newMember === true) {
        whichEmployeeRole();
    }

    else {
        printFile();
    }
})

}

const whichEmployeeRole = () => {
    inquirer.prompt([   
        {
            type: "list",
            name: "employeeRole",
            message: "What is your next employee's role?",
            choices: ["Manager", "Engineer", "Intern"]
        }
    ])
    
    .then(response => {
        if (response.employeeRole === "Manager") {
            newManager();
        }

        else if (response.employeeRole === "Engineer") {
            newEngineer();
        }
    
        else if (response.employeeRole === "Intern") {
            newIntern();
        }
        
        else {
            printFile();
        }
    })

}



const printFile = () => {

    const thisNewTeam = render(employeeArray);


    fs.writeFile(outputPath, thisNewTeam, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("Success! Your team.html file is in your output folder.");
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



