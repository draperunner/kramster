/* eslint-disable */
conn = new Mongo();
db = conn.getDB('kramster-test');

cursor = db.exams.find();
while (cursor.hasNext()) {
  var exam = cursor.next();
  var questionIds = [];
  for (var i = 0; i < exam.questions.length; i++) {
    var question = exam.questions[i];
    var operationStatusObject = db.questions.insertOne(question);
    var questionId = operationStatusObject.insertedId;
    questionIds.push(questionId);
  }
  exam.questions = questionIds;
  db.exams.save(exam);
}
