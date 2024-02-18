import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

/**
 * Fills the emulator database with some test data.
 * Make sure the emulators are running first.
 */

async function main() {
  let app;

  try {
    app = initializeApp({
      projectId: "kramster-staging",
    });

    const db = getFirestore(app);

    db.settings({
      host: "localhost",
      port: 8080,
    });

    const schoolAbbreviation = "ntnu";

    const school = {
      abbreviation: schoolAbbreviation.toUpperCase(),
      name: "Norges Teknisk-Naturvitenskaplige Universitet",
    };

    await db.collection("schools").doc(schoolAbbreviation).set(school);

    const course = {
      code: "ttm4100",
      name: "Communication Services and Networks",
      school: schoolAbbreviation,
    };

    await db.collection("courses").doc(course.code).set(course);

    const exam = {
      course: course.code,
      courseName: course.name,
      mode: "TF",
      name: "2014 Spring",
      school: schoolAbbreviation,
      schoolName: school.name,
    };

    await db.collection("exams").add(exam);

    const trueFalseQuestionTemplate = {
      options: ["True", "False"],
      course: course.code,
      school: schoolAbbreviation,
      exam: exam.name,
      stats: {
        successRate: 0,
        totalAnswers: 0,
        totalCorrect: 0,
      },
    };

    const questions = [
      {
        question:
          "A protocol defines the format and the order of messages exchanged between two communicating entities.",
        answers: [0],
      },
      {
        question:
          "Packets are transmitted over each communication link at a rate equal to the full transmission rate of the link.",
        answers: [0],
      },
      {
        question:
          "In circuit-switched networks, the resources needed along a path to provide for communication between the end systems are reserved for the duration of the communication session between the end systems.",
        answers: [0],
      },
      {
        question:
          "The transmission delay has nothing to do with the distance between routers.",
        answers: [0],
      },
      {
        question:
          "Store-and-forward transmission means that the switch must receive the entire packet before it can begin to transmit the first bit of the packet onto the outbound link.",
        answers: [0],
      },
      {
        question:
          "At each layer, a packet has typically two components: header fields and a payload, where the payload is from the layer below.",
        answers: [1],
      },
      {
        question:
          "Bit errors are equally common in wireless links as in wired links.",
        answers: [1],
      },
      {
        question:
          "Bit errors are equally common in wireless links as in wired links.",
        answers: [1],
      },
      {
        question:
          "For a given modulation scheme, the higher the SNR (signal-to-noise ratio), the higher the BER (bit error rate).",
        answers: [1],
      },
      {
        question:
          "HTTP streaming is more widely used than UDP streaming by today’s Internet video streaming applications.",
        answers: [0],
      },
      {
        question:
          "Consider a server (S) and a client (C) connected through a router (R) by two communication links: S – R – C. Let r1 denote the rate of the link between the server and the router, and r2 the rate of the link between the router and the client. Then, the server-to-client throughput is (r1+r2)/2.",
        answers: [1],
      },
      {
        question:
          "In case of a Web application, there are two distinct programs that communicate with each other, namely the Web browser program and the Web server program.",
        answers: [0],
      },
      {
        question:
          "There is no difference between network architecture and application architecture.",
        answers: [1],
      },
      {
        question:
          "There is no difference between network architecture and application architecture.",
        answers: [1],
      },
      {
        question: "HTTP is a stateless protocol.",
        answers: [0],
      },
      {
        question: "HTTP is a stateless protocol.",
        answers: [0],
      },
      {
        question: "HTTP and FTP run on top of UDP rather than TCP.",
        answers: [1],
      },
    ];

    for (const question of questions) {
      await db.collection("questions").add({
        ...trueFalseQuestionTemplate,
        ...question,
        random: Math.floor(Math.random() * 10000),
      });
    }

    await db
      .collection("stats")
      .doc("global")
      .set({
        grades: {
          A: 0,
          B: 0,
          C: 0,
          D: 0,
          E: 0,
          F: 0,
        },
        lastUpdated: Timestamp.now(),
        numReports: 0,
        totalScore: 0,
      });

    console.log("Done!");
  } catch (error) {
    console.error(error);
  } finally {
    if (app) {
      deleteApp(app);
    }
  }
}

main();
