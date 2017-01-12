import React from 'react';

const About = () => (
  <div>
    <div id="about" className="jumbotron">
      <div className="container">
        <h1>Cram with Kramster!</h1>
      </div>
      <div className="container">
        <h3>
          {Kramster helps making exam preparation a little more fun. Select your school and course and cram for your
          exam by doing the multiple choice questions with instant feedback!}
        </h3>
        <p>
          {Can't find your course's exams on Kramster? Just send the PDFs to
          <a href="mailto:matsbyr@gmail.com">matsbyr@gmail.com</a>, and the small Kramster elves will add them for you.
            That's a great way to help your fellow students, don't you think?}
        </p>
        <p>
          {Kramster is made by <a href="http://byrkje.land">Mats Byrkjeland</a>, a computer science student at NTNU,
          Norway. It is <a href="http://github.com/draperunner/Kramster">open source</a> and has a free, open
          <a href="http://github.com/draperunner/Kramster#api">API</a>.}
        </p>
      </div>
    </div>

    <div className="row top-buffer">
      <div className="col-md-4">
        <kitem
          head="Add exam" body="As easy as sending an email. Literally." color="red"
          ng-click="goExternal('mailto:matsbyr@gmail.com')"
        />
      </div>
      <div className="col-md-4">
        <kitem
          head="API" body="Do cool stuff with Kramster data." color="red"
          ng-click="goExternal('http://github.com/draperunner/Kramster#api')"
        />
      </div>
      <div className="col-md-4">
        <kitem
          head="Code" body="It's all out there." color="red"
          ng-click="goExternal('http://github.com/draperunner/Kramster')"
        />
      </div>
    </div>
  </div>
);

export default About;
