import fs from "fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { addDoc, getDocs, collection } from "firebase/firestore";

const PROJECT_ID = "kramsterapp";

const anonymousUser = "anonymous_1";

let testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    rules: fs.readFileSync("firestore.rules", "utf8"),
  },
});

const VALID_REPORT = {
  uid: "anonymous_1",
  exam: {
    school: "ntnu",
    course: "tdt4160",
    name: "random",
  },
  createdAt: "2022-05-01T12:00:00+02:00",
  history: [
    { givenAnswer: "A", questionId: "0", wasCorrect: true },
    { givenAnswer: "A", questionId: "1", wasCorrect: true },
    { givenAnswer: "A", questionId: "2", wasCorrect: true },
    { givenAnswer: "A", questionId: "3", wasCorrect: true },
    { givenAnswer: "A", questionId: "4", wasCorrect: true },
    { givenAnswer: "A", questionId: "5", wasCorrect: true },
    { givenAnswer: "A", questionId: "6", wasCorrect: true },
    { givenAnswer: "A", questionId: "7", wasCorrect: true },
    { givenAnswer: "A", questionId: "8", wasCorrect: true },
    { givenAnswer: "A", questionId: "9", wasCorrect: false },
  ],
  score: 9,
  numQuestions: 10,
  percentage: 90,
  grade: "A",
};

beforeEach(async () => {
  await testEnv.clearFirestore({ projectId: PROJECT_ID });
});

describe("Read exams", () => {
  it("Can read exams if logged in as anonymous", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const examsCollection = collection(context.firestore(), "exams");
    await assertSucceeds(getDocs(examsCollection));
  });

  it("Cannot read exams if not logged in", async () => {
    const context = testEnv.unauthenticatedContext();
    const examsCollection = collection(context.firestore(), "exams");
    await assertFails(getDocs(examsCollection));
  });
});

describe("Reports", () => {
  it("Cannot read reports", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    await assertFails(getDocs(reportsCollection));
  });

  it("Can create valid report", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    await assertSucceeds(addDoc(reportsCollection, VALID_REPORT));
  });

  it("Cannot have additional fields", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    await assertFails(
      addDoc(reportsCollection, { ...VALID_REPORT, fake: true }),
    );
  });

  it("Cannot have missing fields", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    const { createdAt, ...partialReport } = VALID_REPORT;
    await assertFails(addDoc(reportsCollection, partialReport));
  });

  it("Score cannot be negative", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    const report = { ...VALID_REPORT, score: -10 };
    await assertFails(addDoc(reportsCollection, report));
  });

  it("Cannot be for other user than self", async () => {
    const context = testEnv.authenticatedContext(anonymousUser);
    const reportsCollection = collection(context.firestore(), "reports");
    const report = { ...VALID_REPORT, uid: "another-user" };
    await assertFails(addDoc(reportsCollection, report));
  });
});

after(async () => {
  await testEnv.clearFirestore({ projectId: PROJECT_ID });
});
