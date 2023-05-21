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
    };
  });
  return preprocessed_data;
}

function normalize_data(preprocessed_data) {
    let minMaxYear = findMinMax(preprocessed_data, "year")
    var yearNormalizer = d3.scaleLinear().domain([minMaxYear.min, minMaxYear.max]).range([0, 1]);

    let minMaxRank = findMinMax(preprocessed_data, "rank")
    var rankNormalizer = d3.scaleLinear().domain([minMaxRank.min, minMaxRank.max]).range([0, 1]);

    let minMaxMinplayers = findMinMax(preprocessed_data, "minplayers")
    var minplayersNormalizer = d3.scaleLinear().domain([minMaxMinplayers.min, minMaxMinplayers.max]).range([0, 1]);

    let minMaxMaxplayers = findMinMax(preprocessed_data, "maxplayers")
    var maxplayersNormalizer = d3.scaleLinear().domain([minMaxMaxplayers.min, minMaxMaxplayers.max]).range([0, 1]);

    let minMaxMinplaytime = findMinMax(preprocessed_data, "minplaytime")
    var minplaytimeNormalizer = d3.scaleLinear().domain([minMaxMinplaytime.min, minMaxMinplaytime.max]).range([0, 1]);

    let minMaxMaxplaytime = findMinMax(preprocessed_data, "maxplaytime")
    var maxplaytimeNormalizer = d3.scaleLinear().domain([minMaxMaxplaytime.min, minMaxMaxplaytime.max]).range([0, 1]);

    let minMaxMinage = findMinMax(preprocessed_data, "minage")
    var minageNormalizer = d3.scaleLinear().domain([minMaxMinage.min, minMaxMinage.max]).range([0, 1]);

    let minMaxRating = findMinMax(preprocessed_data, "rating")
    var ratingNormalizer = d3.scaleLinear().domain([minMaxRating.min, minMaxRating.max]).range([0, 1]);

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
  
function LDA() {
  Ldaclasses = ["class1"];
  LdaDataIdeas = [
    //Attr Names: "rating", "year", "minplayers",  "maxplayers", "minplaytime", "maxplaytime", "minage"],
    [8.67527, 2017, 1, 4, 60, 120, 14],
  ];

  data = {
    year: 2017,
    rank: 1,
    minplayers: 1,
    maxplayers: 4,
    minplaytime: 60,
    maxplaytime: 120,
    minage: 14,
    rating: 8.67527,
    types: {
      categories: [
        { id: 1022, name: "Adventure" },
        { id: 1020, name: "Exploration" },
        { id: 1010, name: "Fantasy" },
        { id: 1046, name: "Fighting" },
        { id: 1047, name: "Miniatures" },
      ],
    },
  };

  //you likely want to preprocess the data and load it in from the server.
  NumberData = [
    [1, 3, 3, 4, 5], // a
    [1, 2, 3, 24, 5],
    [1, 24, 3, 4, 2],
    [1, 2, 36, 5, 5],
    [1, 21, 3, 4, 5],
    [12, 2, 3, 7, 5],
  ];

  classes = ["a", "a", "b", "b", "a", "a"];

  const X = druid.Matrix.from(NumberData); // X is the data as object of the Matrix class.

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: classes, d: 2 }); //2 dimensions, can use more.
  const result = reductionLDA.transform();

  console.log(result.to2dArray); //convenience method: https://saehm.github.io/DruidJS/Matrix.html
}
