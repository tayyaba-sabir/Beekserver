const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Job, UserJob } = require('../models');
const { ApplicationError } = require('../utils/errors');


exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '9h' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeUniqueConstraintError' && error.errors.length > 0) {
      const uniqueConstraintError = error.errors[0];
      const { path, value } = uniqueConstraintError;
      let errorMessage = `User with ${path} '${value}' already exists.`;

      next(new ApplicationError(errorMessage, 400));
    } else {
      next(new ApplicationError('Failed to sign up', 500));
    }
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '9h' });

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    next(new ApplicationError('Failed to log in', 500));
  }
};

exports.getUserDashboard = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.userId;

    const allJobs = await Job.findAll({
      attributes: ['id', 'title', 'description', 'salary', 'location'],
    });

    const appliedJobs = await UserJob.findAll({
      attributes: ['status', 'jobId'],
      where: { userId, status: true },
    });

    const appliedJobsMap = {};
    appliedJobs.forEach((appliedJob) => {
      appliedJobsMap[appliedJob.jobId] = true;
    });

    const userDashboard = allJobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      salary: job.salary,
      location: job.location,
    }));

    const jobsApplied = appliedJobs.map((appliedJob) => ({
      id: appliedJob.jobId,
      status: true,
    }));

    res.json({ userDashboard, appliedJobs: jobsApplied });
  } catch (error) {
    console.error(error);
    next(new ApplicationError('Failed to get user dashboard', 500));
  }
};

exports.applyToJob = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.userId;
    const jobId = req.params.jobId;
    const resumeFileName = req.file;

    console.log('User ID:', userId);
    console.log('Job ID:', jobId);
    console.log('Resume:', resumeFileName);

    const jobExists = await Job.findByPk(jobId);
    if (!jobExists) {
      return res.status(404).json({ error: 'Job not found', message: 'Job with the given ID does not exist' });
    }

    const existingApplication = await UserJob.findOne({
      where: {
        userId,
        jobId,
      },
    });

    if (existingApplication) {
      const hasApplied = existingApplication.status;
      return res.status(400).json({ hasApplied, error: 'Already applied', message: 'Application already submitted' });
    }

    if (!resumeFileName) {
      return res.status(400).json({ error: 'Resume not found', message: 'User must upload a resume to apply' });
    }

    if (resumeFileName.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file format', message: 'Only PDF files are allowed' });
    }

    const createdApplication = await UserJob.create({
      userId,
      jobId,
      status: true,
      resume: resumeFileName.filename,
    });

    if (!createdApplication) {
      throw new Error('Failed to create UserJob record');
    }

    res.status(201).json({ message: 'Application successful' });
  } catch (error) {
    console.error('Error applying for the job:', error);
    next(new ApplicationError('Failed to submit application', 500));
  }
};
