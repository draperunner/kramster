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

If you encounter any problems or have any questions regarding the API, please [contact me](mailto:matsbyr@gmail.com) or open an issue on GitHub.

__Table of Contents__:
* [Exams](#exams)
* [Reports](#reports)
* [Stats](#stats)
* [List](#list)

### Exams <a name="exams"/>
An exam contains a bunch of questions and some meta data.

#### Endpoints:
| Endpoint       | Returns exams for...
| ---------------|:------------
| `GET http://kramster.it/api/exams` | All schools and courses.
| `GET http://kramster.it/api/exams/:school` | A given school. School parameter can either be a full school name or an abbreviation.
| `GET http://kramster.it/api/exams/:school/:course` | A given course at a given school. Course parameter can either be a full course name or a course code.
| `GET http://kramster.it/api/exams/:school/:course/:name` | A specific exam for a given course at a given school. Full name of exam must be given.

#### Query Parameters
All above endpoints can be given the following query parameters:

| Key       | Allowed Values               | Default value/behavior (if omitted) | Description
| ----------|:-----------------------------|:---------------------------|:---------------------------------------------------------
| mode      | `tf`, `mc`                   | `tf,mc`                    | Returns True/False (tf) exams only, Multiple Choice (mc) only, or both.
| shuffle   | `q`, `a`, `mc`, `tf`, `none` | `mc`                       | Shuffles questions (`q`), their answers (`a`), or both (`q,a`). If `mc`, shuffling happens only if the exam has multiple choice questions. If `tf`, shuffling happens if the exam has only true/false questions.
| random    | `true`, `false`              | `false`                    | Picks a number of random questions (10, unless limit is set) from resulting set of exams. PS! See below for response.
| sort      | `created`, `name`, `school`, `course` | `created` (chronologically) | Sort the result by one or more fields separated by commas. Put a - before a field for descending order.
| limit     | An integer >= 0 | No limitations | Number of returned exams will not exceed this number. If random=true, this is the number of random questions to return.

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
| Endpoint       | Returns reports for...
| ---------------|:------------
| `GET http://kramster.it/api/reports` | All schools and courses.
| `GET http://kramster.it/api/reports/:school` | A given school. School parameter can either be a full school name or an abbreviation.
| `GET http://kramster.it/api/reports/:school/:course` | A given course at a given school. Course parameter can either be a full course name or a course code.
| `GET http://kramster.it/api/reports/:school/:course/:exam` | A specific exam for a given course at a given school. Full name of exam must be given.

PS! In addition to a valid exam name, the `:exam` parameter can also be `random` or `all`.

#### Query Parameters
The above endpoints can be given the following query parameters:

| Key       | Allowed values               | Default value/behavior (if omitted) | Description                                      
| ----------|:-----------------------------|:---------------------------|:---------------------------------------------------------
| mode      | `tf`, `mc`                   | `tf,mc`                | Returns reports from True/False (tf) exams only, Multiple Choice (mc) only, or both.
| after     | A timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ` | No limitations | Returns reports created after this time.
| before     | A timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ` | No limitations | Returns reports created before this time.
| sort      | `created`, `score`, `numQuestions`, `percentage`, `grade` | `created` (chronologically) | Sort the result by one or more fields separated by commas. Put a - before a field for descending order.
| limit     | An integer >= 0 | No limitations | Number of returned exams will not exceed this number.
| score      | A number. Prepend `<` or `>` for range check. Separate with comma for interval, i.e. `>8,<12`. | No limitations | Return only reports with score less than, greater than or equal to this integer.
| numQuestions | A number. Prepend `<` or `>` for range check. Separate with comma for interval, i.e. `>8,<12`. | No limitations | Return only reports with a number of questions in given interval.
| percentage | A number. Prepend `<` or `>` for range check. Separate with comma for interval, i.e. `>8,<12`.  | No limitations | Return only reports with a number of questions in given interval.
| grade | A letter grade. Prepend `<` or `>` for range check. Separate with comma for interval, i.e. `>D,<A`.  | No limitations | Return only reports with a grade in given interval. Case-insensitive.

#### Response
The response from asking the Reports API will be in form of the following JSON object we'll call **Report**:

```javascript
{
    _id: ObjectId,
    exam: {
        school: String,
        course: String,
        name: String
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
| Endpoint       | Returns stats for...
| ---------------|:------------
| `GET http://kramster.it/api/stats` | All schools and courses.
| `GET http://kramster.it/api/stats/:school` | A given school. School parameter can either be a full school name or an abbreviation.
| `GET http://kramster.it/api/stats/:school/:course` | A given course at a given school. Course parameter can either be a full course name or a course code.
| `GET http://kramster.it/api/stats/:school/:course/:exam` | A specific exam for a given course at a given school. Full name of exam must be given.
| `GET http://kramster.it/api/stats/:school/:course/random` | Quizzes where a number of random questions were picked from the course. (One of the "random" buttons were clicked.)
| `GET http://kramster.it/api/stats/:school/:course/all` | Quizzes where all the questions from the course were given. (The "all" button was clicked.)

#### Query Parameters
| Key   | Allowed values   | Default value/behavior (if omitted) | Description
| ------|:-----------------|:------------------------------------|:---------------------------------------------------------
| numQuestions | An integer. | No limitations | Return stats for reports with this number of questions.

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

| Endpoint       | Returns an array of all...
| ---------------|:------------
| `GET http://kramster.it/api/list/schools` | Distinct school names.
| `GET http://kramster.it/api/list/courses` | Distinct course names.
| `GET http://kramster.it/api/list/courses/:school` | Course names at a given school.
| `GET http://kramster.it/api/list/exams` | Distinct names of exams.
| `GET http://kramster.it/api/list/exams/:school` | Distinct names of the exams at a given school.
| `GET http://kramster.it/api/list/exams/:school/:course` | Names of the exams for a given course at a given school.

#### Query Parameters
| Key   | Allowed values   | Default value/behavior (if omitted) | Description
| ------|:-----------------|:------------------------------------|:---------------------------------------------------------
| short | `true`, `false`  | `false`                             | Whether to return the full names (false) or the abbreviations (true). Not available for exam names, which don't have abbreviations.
| sort  | `alphabetically` | `alphabetically` | Sort the result. Put a - before for descending order: `-alphabetically`.

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
