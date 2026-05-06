// ============================================================
// hfController.js  —  MOSTAFA's file
// Exports three functions used by other controllers:
//   classifyJob, extractSkillsFromBio, getJobEmbeddings
// ============================================================
const hf = require('../services/hfService');

/**
 * Zero-shot classify a job description.
 * Called inside jobController.createJob and jobController.updateJob.
 * Returns the top-scoring label string.
 */
const classifyJob = async (description) => {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: [description],
      parameters: {
        candidate_labels: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Data Engineering', 'Other'],
      },
    });
    return result[0].labels[0]; // highest-scoring label
  } catch (err) {
    console.error('HF classify error:', err.message);
    return 'Other'; // graceful fallback
  }
};

/**
 * NER-based skill extraction.
 * Called inside profileController.extractSkills.
 * Returns a clean, deduplicated array of skill strings.
 */
const extractSkillsFromBio = async (bio) => {
  try {
    const result = await hf.tokenClassification({
      model: 'dslim/bert-base-NER',
      inputs: bio,
    });
    // Keep B-MISC, I-MISC, B-ORG — technologies and organisations
    const skills = result
      .filter(e => ['B-MISC', 'I-MISC', 'B-ORG'].includes(e.entity_group))
      .map(e => e.word.replace(/^##/, '').trim())
      .filter(w => w.length > 1);
    return [...new Set(skills)]; // deduplicate
  } catch (err) {
    console.error('HF NER error:', err.message);
    return null; // caller uses existing skills on null
  }
};

/**
 * Sentence embeddings for job recommendations.
 * Called inside jobController.getRecommendedJobs.
 * inputs: array of strings — [studentText, jobText1, jobText2, ...]
 * Returns array of embedding vectors (same order as inputs).
 */
const getEmbeddings = async (inputs) => {
  try {
    const embeddings = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs,
    });
    return embeddings;
  } catch (err) {
    console.error('HF embedding error:', err.message);
    return null; // caller falls back to unranked list
  }
};

/**
 * Cosine similarity between two numeric vectors.
 * Pure utility — no HF call.
 */
const cosineSimilarity = (vecA, vecB) => {
  const dot  = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
};

module.exports = { classifyJob, extractSkillsFromBio, getEmbeddings, cosineSimilarity };