exports.applyJob = async (req, res) => res.status(201).json({ success: true });
exports.getMyApplications = async (req, res) => res.json({ success: true });
exports.updateApplicationStatus = async (req, res) => res.json({ success: true });
const express = require("express");
const router = express.Router();
