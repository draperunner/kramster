import React from 'react';
import Kitem from '../../components/Kitem';

const About = () => (
  <div className="container">
    <div id="about" className="jumbotron">
      <div className="container">
        <h1>Cram with Kramster!</h1>
      </div>
      <div className="container">
        <h3>
          Kramster helps making exam preparation a little more fun. Select your school and course and cram for your
          exam by doing the multiple choice questions with instant feedback!
        </h3>
        <p>
          Can&apos;t find your course&apos;s exams on Kramster? Just send the PDFs to
          <a href="mailto:matsbyr@gmail.com">matsbyr@gmail.com</a>, and the small Kramster elves will add them for you.
            That&apos;s a great way to help your fellow students, don&apos;t you think?
        </p>
        <p>
          Kramster is made by <a href="http://byrkje.land">Mats Byrkjeland</a>, a computer science student at NTNU,
          Norway. It is <a href="http://github.com/draperunner/Kramster">open source</a> and has a free, open
          <a href="http://github.com/draperunner/Kramster#api">API</a>.
        </p>
      </div>
    </div>

    <div className="row top-buffer">
      <div className="col-md-4">
        <Kitem
          head="Add exam" body="As easy as sending an email. Literally." color="red"
          onClick="goExternal('mailto:matsbyr@gmail.com')"
        />
      </div>
      <div className="col-md-4">
        <Kitem
          head="API" body="Do cool stuff with Kramster data." color="red"
          onClick="goExternal('http://github.com/draperunner/Kramster#api')"
        />
      </div>
      <div className="col-md-4">
        <Kitem
          head="Code" body="It's all out there." color="red"
          onClick="goExternal('http://github.com/draperunner/Kramster')"
        />
      </div>
    </div>
  </div>
);

export default About;
