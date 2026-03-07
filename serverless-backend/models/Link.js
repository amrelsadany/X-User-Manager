import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  userId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
});

// Prevent model recompilation in serverless environment
export default mongoose.models.Link || mongoose.model('Link', linkSchema);
