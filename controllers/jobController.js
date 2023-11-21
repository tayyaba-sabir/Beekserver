const { Job, User, UserJob } = require('../models');
const { ApplicationError } = require('../utils/errors');

exports.createJob = async (req, res, next) => {
  try {
    const { title, description, salary, location } = req.body;

    if (!title || !description || !salary || !location) {
      throw new ApplicationError('Job fields cannot be empty', 400);
    }

    const job = await Job.create({ title, description, salary, location });

    res.status(201).json({ job });
  } catch (error) {
    console.error(error);
    if (error instanceof ApplicationError) {
      next(error);
    } else {
      next(new ApplicationError(`Failed to create job: ${error.message}`, 500));
    }
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll();
    res.json({ jobs });
  } catch (error) {
    console.error(error);
    next(new ApplicationError(`Failed to fetch jobs: ${error.message}`, 500));
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new ApplicationError('Job ID is required', 400);
    }

    const job = await Job.findByPk(id);

    if (!job) {
      throw new ApplicationError(`Job with ID ${id} not found`, 404);
    }

    res.json({ job });
  } catch (error) {
    console.error(error);
    if (error instanceof ApplicationError) {
      next(error);
    } else {
      next(new ApplicationError(`Failed to fetch job: ${error.message}`, 500));
    }
  }
};

