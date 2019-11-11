const MongoClient = require('mongodb').MongoClient;


const chance = require('chance').Chance();

const genArray = (length, callback) => {
  let arr = new Array(length);
  for(let i = 0; i < arr.length; i++) {
    arr[i] = callback();
  }
  return arr;
}

const generateGradedRequirements = (arr) => {
  console.log('Generating Graded Requirements');
  return arr.reduce((acc, requirement) => {
    acc.push({
      requirement,
      score: chance.integer({min: 0, max: 1})
    })
    return acc;
  }, [])
}

const makeProjects = (num) => {
  const projects = [];
  for(let i = 0; i < num; i++) {
    projects.push(new ProjectSchema())
  }
  return projects;
}

const makeSubmissions = (projects, num) => {
  const submissions = [];
  for(let i = 0; i < num; i++) {
    submissions.push(new ProjectSubmission(projects[i%projects.length]));
  }
  return submissions;
}

const main = () => {
  const projects = makeProjects(10);
  console.log(projects);
  const submissions = makeSubmissions(projects, 100);
  console.log(submissions);

  MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    const db = client.db('catalyte_lms_lite');
    const projectCollection = db.collection('projects');
    projectCollection.insertMany(projects);

    const submissionCollection = db.collection('submissions');
    submissionCollection.insertMany(submissions);
  });
}

main();

function ProjectSchema() {
  this.id = chance.guid();
  this.title = chance.animal();
  this.version = chance.integer({min: 1, max: 10});
  this.background = chance.paragraph();
  this.functionalRequirements = genArray(10, () => {return chance.sentence()});
  this.functionalWeight = 70;
  this.nonFunctionalRequirements = genArray(5, () => {return chance.sentence()});
  this.nonFunctionalWeight = 30;
  this.isActive = chance.bool();
}

function ProjectSubmission({id, title, version, background, functionalRequirements, functionalWeight, nonFunctionalRequirements, nonFunctionalWeight, isActive}) {
  this.id = id;
  this.title = title;
  this.version = version;
  this.background = background;
  this.functionalRequirements = generateGradedRequirements(functionalRequirements);
  this.functionalWeight = functionalWeight;
  this.nonFunctionalRequirements = generateGradedRequirements(nonFunctionalRequirements);
  this.nonFunctionalWeight = nonFunctionalWeight;
  this.isActive = isActive;
  this.associateEmail = chance.email();
  this.associateFirstName = chance.first();
  this.associateLastName = chance.last();
  this.notes = chance.paragraph({sentences: 2});
  this.score = chance.floating({min:0, max: 100, fixed: 2});
  this.status = chance.pickone(['not submitted', 'submitted', 'in review', 'needs attention', 'passed']);
  this.submissionLink = chance.url();
  this.grader = chance.pickone(['gfisher@catalyte.io', 'ckoukoutchos@catalyte.io']);
}

// const projectSchema = {
//   id: "uuid",
//   title: "string",
//   version: "int",
//   background: "string",
//   functionalRequirements: "string[]",
//   functionalWeight: "int",
//   nonFunctionalRequirements: "string[]",
//   nonFunctionalWeight: "int",
//   isActive: "boolean"
// }

// const projectSubmissionSchema = {
//   id: "guid",
//   associateEmail: "string",
//   associateFirstName: "string",
//   associateLastName: "string",
//   background: "string",
//   functionalRequirements: "GradedRequirement[]",
//   functionalWeight: "int",
//   nonFunctionalRequirements: "GradedRequirement[]",
//   nonFunctionalWeight: "int",
//   notes: "string",
//   score:"int",
//   status: "string",
//   submissionLink: "string",
//   title: "string",
//   version: "int"
// }

// const gradedRequirementSchema = {
//   requirement: "string",
//   score: "int"
// }