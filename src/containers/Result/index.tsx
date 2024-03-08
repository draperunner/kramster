import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

import { formatPercentage, percentageToGrade, COLORS } from "../../utils";
import { Kitem } from "../../components";
import { useHistory } from "../../hooks/contexts";
import ResultButton from "../../components/Buttons/ResultButton";
import { Grade, HistoryEntry, Stats } from "../../interfaces";

import styles from "./Result.module.css";
import DivChart from "../../components/DivChart";

const db = getFirestore();

function Result(): JSX.Element {
  const { school, course, exam, number } = useParams();

  const [examStats, setExamStats] = useState<Stats>();
  const [history] = useHistory();

  const examName =
    exam === "random" || exam === "hardest" ? `${exam}${number}` : exam;

  useEffect(() => {
    getDocs(
      query(
        collection(db, "stats"),
        where("school", "==", school),
        where("course", "==", course),
        where("exam", "==", examName),
        limit(1),
      ),
    ).then((snap) => {
      if (snap.empty) return;

      const stats = snap.docs[0].data() as Stats | null;

      if (stats) {
        setExamStats(stats);
      }
    });
  }, [school, course, examName]);

  const score = history.filter((q: HistoryEntry) => q.wasCorrect).length;
  const percentage = formatPercentage(score, history.length);
  const grade = percentageToGrade(percentage);

  const totalScore = (examStats?.totalScore || 0) + score;
  const numReports = (examStats?.numReports || 0) + 1;

  const avgPercentage = formatPercentage(
    totalScore,
    numReports * history.length,
  );

  const averageGrade = percentageToGrade(avgPercentage);
  const averageScore = totalScore / numReports;

  const colorFromUser = COLORS[grade];
  const colorFromServer = COLORS[averageGrade];

  return (
    <div>
      <h1 className={styles.header}>Your results</h1>
      <div className={styles.row}>
        <div>
          <Kitem head={grade} body="Grade" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={score} body="Score" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={percentage} body="%" color={colorFromUser} />
        </div>
      </div>

      <h1 className={styles.header}>Stats for this exam</h1>
      <div className={styles.row}>
        <div>
          <Kitem
            head={averageGrade}
            body="Average Grade"
            color={colorFromServer}
          />
        </div>
        <div>
          <Kitem
            head={averageScore}
            body="Average Score"
            color={colorFromServer}
          />
        </div>
        <div>
          <Kitem
            head={avgPercentage}
            body="Average %"
            color={colorFromServer}
          />
        </div>
      </div>

      <div className={styles.row}>
        {examStats?.grades ? (
          <DivChart
            height={200}
            data={Object.keys(examStats?.grades)
              .sort()
              .reverse()
              .map((label) => ({
                label,
                value: examStats.grades[label as Grade] || 0,
              }))}
          />
        ) : null}
        <div>
          <ResultButton
            href={
              "/" + [school, course, exam, number].filter(Boolean).join("/")
            }
          >
            <h4>Try again</h4>
          </ResultButton>
          <ResultButton href={`/${school}/${course}`}>
            <h4>Try another</h4>
          </ResultButton>
        </div>
      </div>
    </div>
  );
}

export default Result;
