import { useNavigate, useParams } from "react-router";

import { Kitem, LoadingSpinner } from "../../components";
import styles from "./Courses.module.css";

import index from "../../index.json";

function Courses() {
  const { school } = useParams();
  const navigate = useNavigate();

  if (!school) {
    return null;
  }

  const schoolData = index.schools.find(
    (s) => s.abbreviation.toLowerCase() === school,
  );
  const courses = schoolData?.courses || [];

  if (!courses.length) {
    return <LoadingSpinner />;
  }

  const availableColors = [
    "orange",
    "green",
    "red",
    "blue",
    "purple",
    "yellow",
  ];
  const assignedColors: { [depCode: string]: string } = {};
  let colorIndex = 0;

  // Assign different colors to each department
  const assignColor = (courseCode: string): string => {
    const firstDigitMatch = courseCode.match(/\d/);
    const indexOfFirstDigit = firstDigitMatch
      ? firstDigitMatch.index || courseCode.length
      : courseCode.length;
    const departmentCode = courseCode.slice(0, indexOfFirstDigit);
    if (assignedColors[departmentCode]) return assignedColors[departmentCode];
    assignedColors[departmentCode] =
      availableColors[colorIndex % availableColors.length];
    colorIndex += 1;
    return assignedColors[departmentCode];
  };

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
              color={assignColor(code)}
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
