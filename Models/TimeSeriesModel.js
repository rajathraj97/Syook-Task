const mongoose = require('mongoose');

const timeSeriesSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  data: [
    {
      name: String,
      origin: String,
      destination: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const TimeSeriesModel = mongoose.model('TimeSeries', timeSeriesSchema);

module.exports = TimeSeriesModel;