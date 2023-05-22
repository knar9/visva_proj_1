function preprocess_data(original_data) {
  let preprocessed_data = original_data.map((d) => {
    return {
      year: d.year,
      rank: d.rank,
      minplayers: d.minplayers,
      maxplayers: d.maxplayers,
      minplaytime: d.minplaytime,
      maxplaytime: d.maxplaytime,
      minage: d.minage,
      rating: d.rating.rating,
      reviews: d.rating.num_of_reviews,
    };
  });
  return preprocessed_data;
}

function normalize_data(preprocessed_data) {
  let minMaxYear = findMinMax(preprocessed_data, "year");
  var yearNormalizer = d3
    .scaleLinear()
    .domain([minMaxYear.min, minMaxYear.max])
    .range([0, 1]);

  let minMaxRank = findMinMax(preprocessed_data, "rank");
  var rankNormalizer = d3
    .scaleLinear()
    .domain([minMaxRank.min, minMaxRank.max])
    .range([0, 1]);

  let minMaxMinplayers = findMinMax(preprocessed_data, "minplayers");
  var minplayersNormalizer = d3
    .scaleLinear()
    .domain([minMaxMinplayers.min, minMaxMinplayers.max])
    .range([0, 1]);

  let minMaxMaxplayers = findMinMax(preprocessed_data, "maxplayers");
  var maxplayersNormalizer = d3
    .scaleLinear()
    .domain([minMaxMaxplayers.min, minMaxMaxplayers.max])
    .range([0, 1]);

  let minMaxMinplaytime = findMinMax(preprocessed_data, "minplaytime");
  var minplaytimeNormalizer = d3
    .scaleLinear()
    .domain([minMaxMinplaytime.min, minMaxMinplaytime.max])
    .range([0, 1]);

  let minMaxMaxplaytime = findMinMax(preprocessed_data, "maxplaytime");
  var maxplaytimeNormalizer = d3
    .scaleLinear()
    .domain([minMaxMaxplaytime.min, minMaxMaxplaytime.max])
    .range([0, 1]);

  let minMaxMinage = findMinMax(preprocessed_data, "minage");
  var minageNormalizer = d3
    .scaleLinear()
    .domain([minMaxMinage.min, minMaxMinage.max])
    .range([0, 1]);

  let minMaxRating = findMinMax(preprocessed_data, "rating");
  var ratingNormalizer = d3
    .scaleLinear()
    .domain([minMaxRating.min, minMaxRating.max])
    .range([0, 1]);

  let minMaxReview = findMinMax(preprocessed_data, "reviews");
  var reviewNormalizer = d3
    .scaleLinear()
    .domain([minMaxReview.min, minMaxReview.max])
    .range([0, 1]);

  let normalized_data = preprocessed_data.map((d) => {
    return {
      year: yearNormalizer(d.year),
      rank: rankNormalizer(d.rank),
      minplayers: minplayersNormalizer(d.minplayers),
      maxplayers: maxplayersNormalizer(d.maxplayers),
      minplaytime: minplaytimeNormalizer(d.minplaytime),
      maxplaytime: maxplaytimeNormalizer(d.maxplaytime),
      minage: minageNormalizer(d.minage),
      rating: ratingNormalizer(d.rating),
      reviews: reviewNormalizer(d.reviews),
    };
  });
  return normalized_data;
}

function findMinMax(array, property) {
  let minValue = array[0][property];
  let maxValue = array[0][property];

  for (let i = 1; i < array.length; i++) {
    const value = array[i][property];

    if (value < minValue) {
      minValue = value;
    }

    if (value > maxValue) {
      maxValue = value;
    }
  }

  return { min: minValue, max: maxValue };
}

function LDA(normalized_data) {
  let array = normalized_data.map((d) => {
    return [
      d.year,
      d.rank,
      d.minplayers,
      d.maxplayers,
      d.minplaytime,
      d.maxplaytime,
      d.minage,
      d.rating,
    ];
  });

  let classes = normalized_data.map((d) => {
    var cl = null;
    if (d.reviews <= 0.25) {
      cl = "not popular";
    } else if (d.reviews <= 0.50) {
      cl = "less popular";
    } else if (d.reviews <= 0.75) {
      cl = "popular";
    }  
    else {
      cl = "very popular";
    }

    return cl;
  });
  // console.log(classes);

  const X = druid.Matrix.from(array);

  const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }); //2 dimensions, can use more.
  const result = reductionLDA.transform();

  console.log(result.to2dArray);
  let temp = result.to2dArray.map( (d) => {
    return {
      "0": d[0],
      "1": d[1]
    }
  })

  console.log("0 column min max")
  console.log(findMinMax(temp, "0"))
  console.log("1 column min max")
  console.log(findMinMax(temp, "1"))

  return {
    classes: classes,
    data: result
  }
}
