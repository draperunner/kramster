import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { Exam } from "../../interfaces";
import CategoryButton from "../../components/Buttons/CategoryButton";
import StandardButton from "../../components/Buttons/StandardButton";
import { LoadingSpinner } from "../../components";

import styles from "./Exams.module.css";

const db = getFirestore();

export function useExams(school: string, course: string): Exam[] {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    getDocs(
      query(
        collection(db, "exams"),
        where("school", "==", school),
        where("course", "==", course),
      ),
    )
      .then((snapshot) =>
        snapshot.docs.map((doc) => {
          const exam = doc.data() as Exam;
          return {
            ...exam,
            id: doc.id,
            questions: exam.questions || [],
          };
        }),
      )
      .then(setExams);
  }, [course, school]);

  return exams;
}

function Exams(): JSX.Element {
  const { school = "", course = "" } = useParams();
  const exams = useExams(school, course);

  if (!exams?.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <h1>{exams[0].courseName}</h1>

      <div className={styles.categoriesRow}>
        <div>
          <CategoryButton href={`/${school}/${course}/random/10`}>
            10 Random
          </CategoryButton>
        </div>
        <div>
          <CategoryButton href={`/${school}/${course}/random/30`}>
            30 Random
          </CategoryButton>
        </div>
        <div>
          <CategoryButton href={`/${school}/${course}/hardest/10`}>
            10 Hardest
          </CategoryButton>
        </div>
      </div>

      <div className={styles.examsGrid}>
        {exams.map(({ id, name }) => (
          <div key={id}>
            <StandardButton
              href={`/${school}/${course}/${encodeURIComponent(name)}`}
            >
              {name}
            </StandardButton>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exams;
