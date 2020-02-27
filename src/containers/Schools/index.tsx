import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-flexbox-grid'
import { useSchools, useStats } from '../../hooks'
import { Kitem, Jumbotron } from '../../components'
import { header, name } from './methods'
import styles from './Schools.css'

function Schools(): JSX.Element {
  const schools = useSchools([
    'Norges Teknisk-Naturvitenskaplige Universitet (NTNU)',
    'Storbyuniversitetet (OsloMet)',
  ])

  const stats = useStats()
  const grades = stats ? stats.grades : null

  return (
    <div>
      <Jumbotron gradesData={grades} />

      <Row className={styles.schoolsRow}>
        {schools.map((school: string) => (
          <Col xs={12} sm={6} lg={3} key={school}>
            <Kitem
              head={header(school)}
              body={name(school)}
              color="green"
              onClick={(): void => browserHistory.push(`/${header(school)}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Schools
