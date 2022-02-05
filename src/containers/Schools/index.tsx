import React, { useState, useEffect } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { Kitem, Jumbotron } from '../../components'
import styles from './Schools.css'
import { School, Stats } from '../../interfaces'

const db = firebase.firestore()

function useStats(): Stats | undefined {
  const [stats, setStats] = useState<Stats | undefined>()

  useEffect(() => {
    db.collection('stats')
      .doc('global')
      .get()
      .then((doc) => doc.data() as Stats)
      .then(setStats)
  }, [])

  return stats
}

function useSchools(initialSchools: School[]): School[] {
  const [schools, setSchools] = useState<School[]>(initialSchools)

  useEffect(() => {
    db.collection('schools')
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({
          ...(doc.data() as School),
          id: doc.id,
        })),
      )
      .then(setSchools)
  }, [])

  return schools
}

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

      <div className={styles.schoolsGrid}>
        {schools.map((school: School) => (
          <div key={school.id}>
            <Kitem
              head={school.abbreviation}
              body={school.name}
              color="green"
              onClick={(): void => browserHistory.push(`/${school.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Schools
