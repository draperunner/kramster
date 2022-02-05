import React from 'react'
import { Kitem } from '../../components'
import styles from './About.css'

const About = (): JSX.Element => (
  <div>
    <div className={styles.about}>
      <h1 className={styles.title}>Cram with Kramster!</h1>
      <h3 className={styles.intro}>
        Kramster helps making exam preparation a little more fun. Select your
        school and course and cram for your exam by doing the multiple choice
        questions with instant feedback!
      </h3>
      <p>
        Can&apos;t find your course&apos;s exams on Kramster? Just send the PDFs
        to <a href="mailto:matsbyr@gmail.com">matsbyr@gmail.com</a>, and the
        small Kramster elves will add them for you. That&apos;s a great way to
        help your fellow students, don&apos;t you think?
      </p>
      <p>
        Kramster is made by <a href="http://byrkje.land">Mats Byrkjeland</a>. It
        is <a href="http://github.com/draperunner/Kramster">open source</a> and
        has a free, open{' '}
        <a href="https://github.com/draperunner/Kramster/wiki/API-Reference">
          API
        </a>
        .
      </p>
      <p>
        Do you enjoy Kramster? Like it on{' '}
        <a href="https://www.facebook.com/kramsterit">Facebook</a> and star it
        on <a href="https://github.com/draperunner/kramster">GitHub</a>!
      </p>
    </div>

    <div className={styles.linksRow}>
      <div className={styles.linkItem}>
        <Kitem
          head="Add exam"
          body="As easy as sending an email. Literally."
          color="red"
          onClick={(): void => {
            window.location.href = 'mailto:matsbyr@gmail.com'
          }}
        />
      </div>
      <div className={styles.linkItem}>
        <Kitem
          head="API"
          body="Do cool stuff with Kramster data."
          color="red"
          onClick={(): void => {
            window.location.href =
              'https://github.com/draperunner/Kramster/wiki/API-Reference'
          }}
        />
      </div>
      <div className={styles.linkItem}>
        <Kitem
          head="Code"
          body="It's all out there."
          color="red"
          onClick={(): void => {
            window.location.href = 'http://github.com/draperunner/Kramster'
          }}
        />
      </div>
    </div>
  </div>
)

export default About
