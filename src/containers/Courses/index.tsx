import { useNavigate, useParams } from "react-router";

import { Kitem, LoadingSpinner } from "../../components";
import styles from "./Courses.module.css";

import index from "../../index.json";

const COLORS = ["orange", "green", "red", "blue", "purple", "yellow"];

function departmentFromCourseCode(courseCode: string): string {
  const firstDigitMatch = courseCode.match(/\d/);
  const indexOfFirstDigit = firstDigitMatch
    ? firstDigitMatch.index || courseCode.length
    : courseCode.length;
  return courseCode.slice(0, indexOfFirstDigit);
}

function Courses() {
  const { school } = useParams();
  const navigate = useNavigate();

  const schoolData = index.schools.find((s) => s.abbreviation.toLowerCase() === school);
  const courses = schoolData?.courses || [];

  const departmentColors: { [courseCode: string]: string } = courses.reduce(
    (assignedColors, { code }) => {
      const departmentCode = departmentFromCourseCode(code);

      if (assignedColors[departmentCode]) {
        return assignedColors;
      }

      const colorIndex = Object.keys(assignedColors).length % COLORS.length;
      const newColor = COLORS[colorIndex];

      assignedColors[departmentCode] = newColor;

      return assignedColors;
    },
    {} as { [courseCode: string]: string },
  );

  if (!school) {
    return null;
  }

  if (!courses.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <h1>
        {schoolData?.abbreviation} – {schoolData?.name}
      </h1>
      <div className={styles.coursesGrid}>
        {courses.map(({ code, name }) => (
          <div key={code}>
            <Kitem
              head={code.toUpperCase()}
              body={name}
              color={departmentColors[departmentFromCourseCode(code)]}
              minHeight
              onClick={() => {
                void navigate(`/${school}/${code}`, { viewTransition: true });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Component = Courses;
