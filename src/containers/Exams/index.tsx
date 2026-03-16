import { useParams } from "react-router";

import CategoryButton from "../../components/Buttons/CategoryButton";
import StandardButton from "../../components/Buttons/StandardButton";
import { LoadingSpinner } from "../../components";

import styles from "./Exams.module.css";

import index from "../../index.json";

function Exams() {
  const { school = "", course = "" } = useParams();

  const courseData = index.schools
    .find((s) => s.abbreviation.toLowerCase() === school.toLowerCase())
    ?.courses.find((c) => c.code.toLowerCase() === course.toLowerCase());

  const exams = courseData?.exams || [];

  if (!courseData || !exams.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <h1>
        {courseData.code.toUpperCase()} – {courseData.name}
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
