import { useParams } from "react-router";

import CategoryButton from "../../components/Buttons/CategoryButton";
import StandardButton from "../../components/Buttons/StandardButton";
import { LoadingSpinner } from "../../components";

import styles from "./Exams.module.css";

import examsIndex from "../../exams.json";

function Exams(): JSX.Element {
  const { school = "", course = "" } = useParams();

  const exams = examsIndex.filter(
    (exam) =>
      exam.school === school.toLowerCase() &&
      exam.course === course.toLowerCase(),
  );

  if (!exams?.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <h1>
        {exams[0].course.toUpperCase()} – {exams[0].courseName}
      </h1>

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
      </div>

      <div className={styles.examsGrid}>
        {exams.map(({ name }) => (
          <div key={name}>
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

export const Component = Exams;
