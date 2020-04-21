const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const joi = require("joi");
const render = require("./lib/htmlRenderer");

//outputPath will later be passed into the writeFile function 

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

//All the employee objects will be stored in the employeeArray

const employeeArray = [];

//welcomePrompt appears first to give the user a sense of what to expect from the app. Once, they hit enter, newManager function is run.

const welcomePrompt = () => {

    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Welcome! This app will generate a professional Engineering Team Profile page using your input. There must be at least one manager, so you'll be prompted for that first. Add as many employees as you'd like. When you have no more employees to add, you'll find your team.html in the output folder. Let's begin! Press enter to continue."
            
        },])
        .then(response => {
           
            newManager();
        });
    }


//newManager prompts the user for Manager info and then assigns those values to a new Manager object and pushes that object into the employeeArray. Afterwards, nextQuestion function is run.

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

//newEngineer prompts the user for Engineer info and then assigns those values to a new Engineer object and pushes that object into the employeeArray. Afterwards, nextQuestion function is run.

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

//newIntern prompts the user for Intern info and then assigns those values to a new Intern object and pushes that object into the employeeArray. Afterwards, nextQuestion function is run.

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

//nextQuestion prompts the user to determine whether or not they'd like to add another team member. If so, it runs the whichEmployeeRole function. If not, printFile is run.

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

//whichEmployeeRole determines the user's next employee's role. Then the appropriate function is run to create the Employee object.

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
    
    })

}

//printFile renders the final HTML using the render function declared in htmlRenderer.js, taking in the employeeArray containing all the new employee objects. It assigns that HTML to thisNewTeam which is then passed into writeFile.


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

//using Joi, these functions validate the prompts.

function validateNumber(name) {
   let schema = joi.number().required();
   return joi.validate(name, schema, onValidation);
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

welcomePrompt();



