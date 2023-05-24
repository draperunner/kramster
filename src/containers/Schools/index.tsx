import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getFirestore,
  getDoc,
  doc,
  collection,
  getDocs,
  query,
} from 'firebase/firestore'

import { Kitem, Jumbotron } from '../../components'
import styles from './Schools.css'
import { School, Stats } from '../../interfaces'

const db = getFirestore()

function useStats(): Stats | undefined {
  const [stats, setStats] = useState<Stats | undefined>()

  useEffect(() => {
    getDoc(doc(collection(db, 'stats'), 'global'))
      .then((doc) => doc.data() as Stats)
      .then(setStats)
  }, [])

  return stats
}

function useSchools(initialSchools: School[]): School[] {
  const [schools, setSchools] = useState<School[]>(initialSchools)

  useEffect(() => {
    getDocs(query(collection(db, 'schools')))
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
  const navigate = useNavigate()
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
  const grades = stats?.grades

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
              onClick={(): void => navigate(`/${school.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Schools
