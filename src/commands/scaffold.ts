import inquirer from 'inquirer';

export async function scaffoldComponent() {
  const questions = [
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the name of the component?',
      validate: input => input ? true : 'Component name is required',
    },
    {
      type: 'input',
      name: 'componentPath',
      message: 'Where should the component be created?',
    },
  ];

  // Check for Jira API token
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  if (jiraApiToken) {
    questions.push({
      type: 'input',
      name: 'jiraTicket',
      message: 'Do you have a Jira ticket number?',
    });
  }

  const answers = await inquirer.prompt(questions);

  console.log('Scaffolding component with the following details:', answers);
  // Implement the scaffolding logic here
}

export async function scaffoldSite() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'siteName',
      message: 'What is the name of the site?',
    },
    {
      type: 'input',
      name: 'sitePath',
      message: 'Where should the site be created?',
    },
    // Add more questions as needed
  ]);

  console.log('Scaffolding site with the following details:', answers);
  // Implement the scaffolding logic here
}
