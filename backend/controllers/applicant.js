'using strict';

const bcrypt = require('bcrypt');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');

const signinForm = require('./signin-form.json');

// TODO add dynamically the choices for the campaign
exports.getSigninForm = (req, res, next) => {
    res.status(201).json(signinForm);
};

// TODO
exports.createApplicant = (req, res, next) => {
  const body = req.body;
  const campaign = body[1].questions[0].answer;
  const name = body[2].questions[0].answer;
  const password = body[2].questions[1].answer;
  const mailAddress = body[3].questions[0].answer;
  const phoneNumber = body[3].questions[1].answer;
  bcrypt.hash(password, BCRYPT_SALTROUNDS).then((hash) => {
    // TODO crypt password
    // TODO add process corresponding to this campaign
    const applicant = new Applicant({
      "campaign": campaign,
      "name": name,
      "password": hash,
      "mailAddress": mailAddress,
      "phoneNumber": phoneNumber,
      "status": 'pending'
    });

    applicant.save().then(() => {
      res.status(201).json({
        message: 'Applicant created successfully'
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(503).json({
      error: {message: "An unknown error occured. Please contact the administrator of this website"}
    });
  });
};

// TODO generate token
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Applicant.findOne({
    email: email
  }).then((applicant) => {
    if (!applicant) {
      console.log(new Error('User or password are incorrect'));
      return res.status(401).json({
        error: new Error('User or password are incorrect')
      });
    }

    bcrypt.compare(password, applicant.password).then((valid) => {
      if (!valid) {
        console.log(new Error('incorrect password'));
        return res.status(401).json({
          error: new Error('Incorrect password!')
        });
        }
        res.status(200).json({
          id: applicant._id,
          token: 'token'
        });
      } ).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

// TODO
exports.getApplicant = (req, res, next) => {
  console.log('TODO get applicant');
  res.status(200)
};

// TODO
exports.editApplicantStep = (req, res, next) => {
  console.log('TODO edit applicant step');
  res.status(200);
};

// TODO
exports.getApplicantStep = (req, res, next) => {
  console.log('TODO get applicant step');
  res.status(200);
};
