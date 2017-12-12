# Kramster!
See it live here: [kramster.it](https://kramster.it)

Kramster is a quiz app for making exam preparation more fun. It works for all exams having multiple choice questions.

## API
The API has four parts: __Exams__, __Reports__, __Stats__, __List__.
You can use the Exams part to get access to all the questions Kramster has to offer, and their answers.
The Reports part is for getting the reports generated when a person has finished an exam.
Use this for detailed analysis of how well the Kramster users do.
The Stats part is for getting some standard accumulated statistics based on the reports.
The List part is for getting a string array of names of schools, courses or exams.

Please see the [API Reference](https://github.com/draperunner/Kramster/wiki/API-Reference) for details on the API.

## Contributing to Data
To add an exam to Kramster, the easiest is to just email me the PDF (matsbyr@gmail.com).

If you want help out with the exam processing, or learn how to add exams to your Kramster clone,
check out the Kramster Data repository (https://github.com/draperunner/kramster-data).

## Installation instructions

To setup Kramster on your machine, you will first need to install Node.js and MongoDB. Then, follow the steps:

```
git clone git@github.com:draperunner/kramster.git
cd kramster
npm install
```

That's basically it. To fire up Kramster locally, run
```
npm start
```
This will run the development server on `http://localhost:8000`.
If you want to run it on another port, specify it with the `KRAMSTER_PORT` environment variable.

You might find that your version of Kramster is a bit boring. That's because your database is empty.
Head over to the Kramster Data repository (https://github.com/draperunner/kramster-data) to see how you can populate
your database.
