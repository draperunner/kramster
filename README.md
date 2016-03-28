# Kramster!
See it live here: [http://kramster.it](http://kramster.it)

## About
Kramster is a quiz app for making exam preparation more fun. It works for all exams having multiple choice questions, where there is only one correct answer per question.

## API
__DEPRECATION WARNING!__ There will be big changes to the API. See the branch [new-api](https://github.com/draperunner/Kramster/tree/new-api) for details.  
The API has three parts: Questions, Reports and Stats. You can use the Questions part to get access to all the questions Kramster has to offer, and their answers. The Reports part is for getting the reports generated when a person has finished an exam. Use this for detailed analysis of how well the Kramster users do. Lastly, the Stats part is for getting some standard accumulated statistics based on the reports.

### Questions
The response from asking the Questions API will be in form of the following JSON object we'll call **Document**:

```javascript
 {
    _id: ObjectId,
    school: String,
    course: String,
    name: String,
    mode: String,
    questions: [{
        question: String,
        options: [String],
        answers: [Number]
    }]
}
```
The **answers** array will contain the indices of the correct answers in the **options** array.


| Method | URL                                                             | Description                                                                 | Return        |
| ------ |:----------------------------------------------------------------|:----------------------------------------------------------------------------|:--------------|
| GET    | http://kramster.it/api/documents                                | Return all documents                                                        | [Document]
| GET    | http://kramster.it/api/documents/:school                        | Return all documents of given school                                        | [Document]
| GET    | http://kramster.it/api/documents/:school/:course                | Return all documents of given school and course                             | [Document]
| GET    | http://kramster.it/api/documents/:school/:course/random/:number | Return a given number of random questions from given course of given school | [Document]
| GET	 | http://kramster.it/api/documents/:school/:course/:document      | Return single document by school, course and document name                  | Document
| GET    | http://kramster.it/api/list/schools                             | Return array of all distinct schools                                        | [String]
| GET    | http://kramster.it/api/list/:school                             | Return array of all distinct courses at given school                        | [String]
| GET    | http://kramster.it/api/list/:school/:course                     | Return array of all distinct documents at given school and course           | [String]

### Reports
The response from asking the Reports API will be in form of the following JSON object we'll call **Report**:

```javascript
{
    _id: ObjectId,
    document: {
        school: String,
        course: String,
        documentName: String
    },
    score: Number,
    numQuestions: Number,
    percentage: Number,
    grade: String
}
```
The **answers** array will contain the indices of the correct answers in the **options** array.

| Method | URL                                                      | Description                                                  | Return
| ------ |:---------------------------------------------------------|:-------------------------------------------------------------|:--------
| GET    | http://kramster.it/api/reports/                          | Return all reports                                           | [Report]
| GET    | http://kramster.it/api/reports/:school                   | Return all reports of given school                           | [Report]
| GET    | http://kramster.it/api/reports/:school/:course           | Return all reports of given school and course                | [Report]
| GET	 | http://kramster.it/api/reports/:school/:course/:document | Return all reports of given school, course and document name | [Report]


### Stats
The response from asking the Stats API will be in form of the following JSON object we'll call **Stats**:

```javascript
{
    numReports: Number,
    grades: {
        A: Number,
        B: Number,
        C: Number,
        D: Number,
        E: Number,
        F: Number
    },
    totalScore: Number,
    averageScore: Number
}
```
The **answers** array will contain the indices of the correct answers in the **options** array.

| Method | URL                                                    | Description                                                         | Return
| ------ |:-------------------------------------------------------|:--------------------------------------------------------------------|:------
| GET    | http://kramster.it/api/stats/                          | Return stats for all reports                                        | Stats
| GET    | http://kramster.it/api/stats/:school                   | Return stats for reports for given school                           | Stats
| GET    | http://kramster.it/api/stats/:school/:course           | Return stats for reports for given school and course                | Stats
| GET	 | http://kramster.it/api/stats/:school/:course/:document | Return stats for reports for given school, course and document name | Stats
