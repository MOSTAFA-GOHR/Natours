
const multer = require('multer');
const sharp = require('sharp');
const Tour = require("./../models/toursModel");
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("./../utils/appError")
const factory = require('./factoryHandler');



//MULTER CONFIGRATION
const multerStrorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please upload only image', 400), false);
  }
};

const upload = multer({
  storage: multerStrorage,
  fileFilter: multerFilter
});

//RESIZING TOUR IMAGE
exports.resizeTourImage = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // image cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-imageCover.jpeg`;

  await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // images
  req.body.images = [];
  await Promise.all(req.files.images.map(async (file, i) => {
    const fileName = `tour-${req.params.id}-${Date.now()}-image-${i + 1}.jpeg`

    await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 })
      .toFile(`public/img/tours/${fileName}`);

    req.body.images.push(fileName);
  }));

  next();
});



//handler
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};



exports.getAllTours = factory.getAll(Tour)
// catchAsync(async (req, res, next) => {
//   //Executed Query
//   const feature = new APIFeatures(Tour.find(), req.query).filter().sort().limitField().pagination();
//   const tours = await feature.query;
//   // const query = Tour.find()
//   // 	.where('duration').equals(req.query.duration)
//   // 	.where('difficulty').equals(req.query.difficulty);

//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours
//     }
//   })
// });

exports.getTour = factory.getOne(Tour, { path: 'reviews', select: '-__v' });
// catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate({
//     path: 'reviews',
//     select: '-__v'
//   });

//   if (!tour) {
//     return next(new AppError("No tour found with that id", 404))
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       tour
//     }
//   })
// }
// );

exports.createTour = factory.createOne(Tour)
//  catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour
//     }
//   });
// });

exports.updateTour = factory.updateOne(Tour);
// catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!tour) {
//     return next(new AppError("No tour found with that id", 404))
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour
//     }
//   });

// });

exports.deleteTour = factory.oneDelete(Tour);
// catchAsync(async (req, res, next) => {
//   console.log('one')
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   console.log('two')

//   if (!tour) {
//     return next(new AppError("No tour found with that id", 404))
//   }
//   console.log('three')

//   res.status(204).json({
//     status: "success",
//     data: null
//   });

// });

exports.getTourStats = catchAsync(async (req, res, next) => {

  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
    // 	$match: { _id: { $ne: 'easy' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  })

});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $sort: { month: 1 }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $limit: 12
    }
  ]);


  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  })
});


exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(new AppError('Please, provide latitude and longtude in the form lat,lng', 400));
  };

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours
    }
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.00062137 : 0.001;

  if (!lat || !lng) {
    return next(new AppError('please provide latitude and longitude in the form lat,lng', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }

  ])

  res.status(200).json({
    status: "success",
    data: {
      data: distances
    }
  })
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 3 },
  { name: 'images', maxCount: 3 }
]);






// some of steps
//Bild Query
// //1-a)Filtering
// const queryObj = { ...req.query };
// const excudedFileds = ['page', 'sort', 'limit', 'fields'];
// excudedFileds.forEach(el => delete queryObj[el]);
// console.log(req.query);

// //1-b)Advanced
// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

// let query = Tour.find(JSON.parse(queryString));


//2)sorting
// if (req.query.sort) {
// 	const sortBy = req.query.sort.split(",").join(" ");
// 	query = query.sort(sortBy);
// } else {
// 	query = query.sort("-createdAt")
// };

//3)Fileds limited
// if (req.query.fields) {
// 	const fields = req.query.fields.split(",").join(" ");
// 	query = query.select(fields)
// } else {
// 	query = query.select("-__v");
// }

// //4)pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
// 	const numsTours = await Tour.countDocuments();
// 	if (skip >= numsTours) throw new Error("'This page dosen't exist!.");
// }


// exports.getAllTours = catchAsync(async (req, res) => {
//   try {
//     console.log(req.query)
//     //Executed Query
//     const feature = new APIFeatures(Tour.find(), req.query).filter().sort().limitField().pagination();
//     const tours = await feature.query;
//     // const query = Tour.find()
//     // 	.where('duration').equals(req.query.duration)
//     // 	.where('difficulty').equals(req.query.difficulty);

//     res.status(200).json({
//       status: "success",
//       results: tours.length,
//       data: {
//         tours
//       }
//     })
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     })
//   }
// });
