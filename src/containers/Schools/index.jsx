import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-flexbox-grid'
import { useSchools, useStats } from '../../hooks'
import Jumbotron from '../../components/Jumbotron'
import Kitem from '../../components/Kitem'
import { header, name } from './methods'
import './Schools.css'

function Schools() {
  const schools = useSchools([
    'Norges Teknisk-Naturvitenskaplige Universitet (NTNU)',
    'Storbyuniversitetet (OsloMet)',
  ])

  const stats = useStats()
  const grades = stats ? stats.grades : null

  return (
    <div>
      <Jumbotron gradesData={grades} />

      <Row className="schoolsRow">
        {schools.map((school) => (
          <Col xs={12} sm={6} lg={3} key={school}>
            <Kitem
              head={header(school)}
              body={name(school)}
              color="green"
              onClick={() => browserHistory.push(`/${header(school)}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Schools
