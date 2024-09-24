import inquirer from "inquirer";
import fs from "fs";

const questions = [
  "Please enter the title of this project.",
  "Please write a brief, yet concise description of this project.",
  "Please describe the steps to install this project.",
  "Please explain how this project is used.",
  "Please reference all contributors and/or collaborators of this project.",
  "Please write tests for this project here and provide examples on how to run them.",
  "Please enter the license assigned to this project.",
  "Please enter your GitHub profile link.",
  "Please provide a contact email address that can be used to reach out to the collaborators.",
];

const licenses = {
  MIT: {
    notice: "This project is licensed under the MIT License.",
    badge:
      "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",
  },
  "Apache 2.0": {
    notice: "This project is licensed under the Apache License 2.0.",
    badge:
      "[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)",
  },
  "GPL 3.0": {
    notice: "This project is licensed under the GPL v3 License.",
    badge:
      "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)",
  },
};

function writeToFile(data) {
  return `# ${data.projectTitle}
  ## Description
  ${data.description}
  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [Credits](#credits)
  - [License](#license)
  - [Tests](#tests)
  - [Questions](#questions)
  ## Installation
  ${data.installGuide}
  ## Usage
  ${data.usageInfo}
  ## Credits
  ${data.credits}
  ## License
  
  ## Tests
  ${data.tests}
  ## Questions
  * GitHubProfile: ${data.gitHubProfile}
  * Contact Email: ${data.contactEmail}`;
}
function init() {
  inquirer
    .prompt([
      {
        type: "input",
        message: questions[0],
        name: "projectTitle",
      },
      {
        type: "input",
        message: questions[1],
        name: "description",
      },
      {
        type: "input",
        message: questions[2],
        name: "installGuide",
      },
      {
        type: "input",
        message: questions[3],
        name: "usageInfo",
      },
      {
        type: "input",
        message: questions[4],
        name: "credits",
      },
      {
        type: "input",
        message: questions[5],
        name: "tests",
      },
      {
        type: "list",
        message: questions[6],
        choices: Object.keys(licenses),
        name: "license",
      },
      {
        type: "input",
        message: questions[7],
        name: "gitHubProfile",
      },
      {
        type: "input",
        message: questions[8],
        name: "contactEmail",
      },
    ])
    .then((data) => {
      fs.writeFile("README.md", writeToFile(data), (error) => {
        if (error) {
          console.error(error);
          return;
        } else {
          console.log("Successfully generated README.md file!");
        }
        const selectedLicense = licenses[data.license];
        const badge = selectedLicense.badge;
        const notice = selectedLicense.notice;

        fs.readFile("README.md", (error, data) => {
          if (error) {
            console.error("Error reading README.md:", error);
            return;
          }
          let updatedData = data.toString();
          if (!updatedData.includes(badge)) {
            updatedData = `${badge}\n${updatedData}`;
          }
          const licenseSectionRegex = /(## License\n)(.*?)(\n)/s;
          if (licenseSectionRegex.test(updatedData)) {
            updatedData = updatedData.replace(
              licenseSectionRegex,
              `$1$2\n${notice}\n\n`
            );
          } else {
            updatedData += `\n## License\n${notice}\n`;
          }
          fs.writeFile("README.md", updatedData, (error) => {
            if (error) {
              console.error("Error writing to README.md:", error);
            } else {
              console.log(
                "The License Section of the README.md file was updated successfully!"
              );
            }
          });
        });
      });
    });
}

init();
