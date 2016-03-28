# Kramster!
See it live here: [http://kramster.it](http://kramster.it)

Kramster is a quiz app for making exam preparation more fun. It works for all exams having multiple choice questions.

## API
The API has four parts: __Exams__, __Reports__, __Stats__, __List__. 
You can use the Exams part to get access to all the questions Kramster has to offer, and their answers. 
The Reports part is for getting the reports generated when a person has finished an exam. 
Use this for detailed analysis of how well the Kramster users do. 
The Stats part is for getting some standard accumulated statistics based on the reports. 
The List part is for getting a string array of names of schools, courses or exams.

__Table of Contents__:
* [Exams](#exams)
* [Reports](#reports)
* [Stats](#stats)
* [List](#list)

### Exams <a name="exams"/>
An exam contains a bunch of questions and some meta data.

#### Endpoints:
```
GET http://kramster.it/api/exams
```
Returns exams for all schools and courses.

```
GET http://kramster.it/api/exams/:school
```
Returns exams for a given school. School parameter can either be a
full school name or an abbreviation.

```
GET http://kramster.it/api/exams/:school/:course
```
Returns exams for a given course at a given school. Course parameter can
either be a full course name or a course code.

```
GET http://kramster.it/api/exams/:school/:course/:name
```
Returns a specific exam for a given course at a given school. Full name
of exam must be given.

#### Query Parameters
All above endpoints can be given the following query parameters:

| Key       | Allowed Values               | Default value/behavior (if omitted) | Description
| ----------|:-----------------------------|:---------------------------|:---------------------------------------------------------
| mode      | `tf`, `mc`                   | `tf,mc`                    | Returns True/False (tf) exams only, Multiple Choice (mc) only, or both.
| shuffle   | `q`, `a`                     | `q,a`                      | Shuffles questions (q), their answers (a), or both. Comma-separated.
| random    | `true`, `false`              | `false`                    | Picks a number of random questions from resulting set of exams. PS! See below for response.
| numRandom | An integer >= 0              | `10`                       | If random=true, this is the number of random questions to return.
| sort      | `created`, `name`, `school`, `course` | `created` (chronologically) | Sort the result by one or more fields separated by commas. Put a - before a field for descending order.
| limit     | An integer >= 0 | No limitations | Number of returned exams will not exceed this number.

#### Response
The response from asking the Exams API will be an array containing objects of the following form that we'll call **Exam**:

```javascript
[
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
    },
    ...
]
```
The **answers** array will contain the indexes of the correct answers in the **options** array.
The questions might contain HTML. Images are base64 encoded and embedded in the question string as HTML img elements.
Mathematical equations are embedded as MathJax equations.

PS! If the `random` parameter is set to true, the response will only contain an array of question objects:
```javascript
[
    {
        question: String,
        options: [String],
        answers: [Number]
    },
    ...
]
```

#### Examples
Return all exams from The Norwegian University of Science and Technology (NTNU):  
[http://kramster.it/api/exams/ntnu](http://kramster.it/api/exams/ntnu)

Return True/False exams from The Norwegian University of Science and Technology (NTNU):  
[http://kramster.it/api/exams/ntnu?mode=tf](http://kramster.it/api/exams/ntnu?mode=tf)

Return 20 random questions from The Norwegian University of Science and Technology (NTNU):  
[http://kramster.it/api/exams/ntnu?random=true&numRandom=20](http://kramster.it/api/exams/ntnu?random=true&numRandom=20)

### Reports <a name="reports"/>
When a user finishes an exam on Kramster, the results are saved as a Report.

#### Endpoints
```
GET http://kramster.it/api/reports
```
Returns reports for all schools and courses.

```
GET http://kramster.it/api/reports/:school
```
Returns reports for a given school. School parameter can either be a
full school name or an abbreviation.

```
GET http://kramster.it/api/reports/:school/:course
```
Returns reports for a given course at a given school. Course parameter can
either be a full course name or a course code.

```
GET http://kramster.it/api/reports/:school/:course/:name
```
Returns reports for a specific exam for a given course at a given school. Full name
of exam must be given.

#### Query Parameters
The above endpoints can be given the following query parameters:

| Key       | Allowed values               | Default value/behavior (if omitted) | Description                                      
| ----------|:-----------------------------|:---------------------------|:---------------------------------------------------------
| mode      | `tf`, `mc`                   | `tf,mc` (shuffles both)                | Returns reports from True/False (tf) exams only, Multiple Choice (mc) only, or both.
| after     | A timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ` | No limitations | Returns reports created after this time.
| before     | A timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ` | No limitations | Returns reports created before this time.
| sort      | `created`, `score`, `numQuestions`, `percentage`, `grade` | `created` (chronologically) | Sort the result by one or more fields separated by commas. Put a - before a field for descending order.
| limit     | An integer >= 0 | No limitations | Number of returned exams will not exceed this number.

#### Response
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
The **answers** array will contain the indexes of the correct answers in the **options** array.

#### Examples
Return all reports for The Norwegian University of Science and Technology (NTNU):  
[http://kramster.it/api/reports/ntnu](http://kramster.it/api/reports/ntnu)

Return the top ten reports for any exam:  
[http://kramster.it/api/reports?sort=-percentage&limit=10](http://kramster.it/api/reports?sort=-percentage&limit=10)

Return the best report for course TDT4136 at NTNU in 2015:  
[http://kramster.it/api/reports/ntnu/tdt4136?sort=-percentage&limit=1&before=2016-01-01T00:00:00Z&after=2014-12-31T23:59:59Z](http://kramster.it/api/reports?sort=-percentage&limit=10)

### Stats <a name="stats"/>
Accumulated statistics for one or multiple exams based on reports.

#### Endpoints
```
GET http://kramster.it/api/stats
```
Returns stats for all schools and courses.

```
GET http://kramster.it/api/stats/:school
```
Returns stats for a given school. School parameter can either be a
full school name or an abbreviation.

```
GET http://kramster.it/api/stats/:school/:course
```
Returns stats for a given course at a given school. Course parameter can
either be a full course name or a course code.

```
GET http://kramster.it/api/stats/:school/:course/:name
```
Returns stats for a specific exam for a given course at a given school. Full name
of exam must be given.


#### Query Parameters
There are no available parameters.

#### Response
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

#### Examples
Return stats for NTNU:  
[http://kramster.it/api/stats/ntnu/](http://kramster.it/api/stats/ntnu)

Return stats for course TDT4136 at NTNU:  
[http://kramster.it/api/stats/ntnu/tdt4136](http://kramster.it/api/stats/ntnu/tdt4136)

### List <a name="list"/>
#### Endpoints
```
GET http://kramster.it/api/list/schools
```
Returns an array of all the (distinct) school names.
```
GET http://kramster.it/api/list/courses/:school
```
Returns an array of all the course names at a given school.
```
GET http://kramster.it/api/list/exams/:school/:course
```
Returns an array of all the names of the exams for a given course at
a given school.

#### Query Parameters
There are no available parameters.

#### Response
The response is an array of strings:
```javascript
[String]
```

### Examples
Return all existing schools  
[http://kramster.it/api/list/schools](http://kramster.it/api/schools)

Return all courses at NTNU:  
[http://kramster.it/api/list/courses/ntnu](http://kramster.it/api/list/courses/ntnu)

Return all exams for the course TDT4136 at NTNU:  
[http://kramster.it/api/list/exams/ntnu/tdt4136](http://kramster.it/api/list/exams/ntnu/tdt4136)
