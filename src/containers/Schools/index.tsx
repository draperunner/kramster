import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-flexbox-grid'
import { useSchools, useStats } from '../../hooks'
import { Kitem, Jumbotron } from '../../components'
import styles from './Schools.css'
import { School } from '../../interfaces'

function Schools(): JSX.Element {
  const schools = useSchools([
    {
      id: 'ntnu',
      abbreviation: 'NTNU',
      name: 'Norges Teknisk-Naturvitenskaplige Universitet',
    },
    {
      id: 'oslomet',
      abbreviation: 'OsloMet',
      name: 'Oslo Metropolitan University',
    },
  ])

  const stats = useStats()
  const grades = stats ? stats.grades : null

  return (
    <div>
      <Jumbotron gradesData={grades} />

      <Row className={styles.schoolsRow}>
        {schools.map((school: School) => (
          <Col xs={12} sm={6} lg={3} key={school.id}>
            <Kitem
              head={school.abbreviation}
              body={school.name}
              color="green"
              onClick={(): void => browserHistory.push(`/${school.id}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Schools
