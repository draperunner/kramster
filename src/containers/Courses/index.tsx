import { useNavigate, useParams } from "react-router-dom";

import { Kitem, LoadingSpinner } from "../../components";
import styles from "./Courses.module.css";

import courseIndex from "../../courses.json";
import schoolIndex from "../../schools.json";

function Courses(): JSX.Element {
  const { school } = useParams();

  const courses = courseIndex.filter(
    (course) => course.school === school?.toLowerCase(),
  );
  const schoolData = schoolIndex.find(
    (s) => s.abbreviation.toLowerCase() === school,
  );
  const navigate = useNavigate();

  if (!courses || !courses.length) {
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
              onClick={(): void => navigate(`/${school}/${code}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Component = Courses;
