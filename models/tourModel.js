const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],//validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      //validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);



// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
//This creates a compound index on both the price and ratingsAverage fields.
//The 1 for price indicates an ascending order for the index on the price field.
//The -1 for ratingsAverage indicates a descending order for the index on the ratingsAverage field.
//This index would be especially beneficial for queries that sort or filter based on these two fields.
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//a virtual is a property that is not stored in the MongoDB database, but is rather derived from the model's values.
//can add computed values and defining relationships that don't need to be stored in the database. 
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
//A tour can have multiple reviews. 
//To find all reviews of a tour, look in the Review model and find all entries where the tour field matches this tour's _id
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
//pre-save middleware, executed before document is saved to db
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  //conver to url friendly name like the-amazing tour
  next();
});

tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  //Promise.all is used to wait until all of the Promises in the guidesPromises array have been resolved.
  //Once they have, the result (an array of user documents) is assigned back to the guides property of the current tour document.
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  ///^find/: regex ensures that this middleware will run before any Mongoose query method that starts with 'find' 
  //(e.g., find, findOne, findOneAndUpdate, etc.).
  this.find({ secretTour: { $ne: true } });
  //modifies the query to exclude documents where secretTour is set to true, so that they can never be found by query

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

//Logs how long the find-like query took to execute
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE: before or after an aggretation happens
tourSchema.pre('aggregate', function(next) {
  //we want to exclude secret tours in all the aggregation, exclude at the model level
  //.unshift({...}) adds a new stage to the beginning of this pipeline.
  //for any aggregation operation on this schema, the first thing you should do is exclude all secret tours.
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema); //like the db table



module.exports = Tour;
