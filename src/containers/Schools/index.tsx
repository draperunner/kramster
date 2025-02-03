import { useNavigate } from "react-router-dom";

import { Kitem, Jumbotron } from "../../components";
import styles from "./Schools.module.css";
import schools from "../../schools.json";

function Schools(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div>
      <Jumbotron />

      <div className={styles.schoolsGrid}>
        {schools.map((school) => (
          <div key={school.abbreviation}>
            <Kitem
              head={school.abbreviation}
              body={school.name}
              color="green"
              onClick={(): void =>
                navigate(`/${school.abbreviation.toLowerCase()}`)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schools;
