/* k-means implementation in 2D */

/**
 * k-means algorithm after Lloyd
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate algorithm on, whereas the array contains the data points; centroid_index can be anything at the beginning.
 * @param k - number of clusters
 * @returns {[{ x, y, centroid_index }, ...]} datapoints - returns the datapoints with the final centroid_index.
 */

function abc(array) {
  let abc = [];
  for (let i = 0; i < array.length; i++) {
    abc.push(array[i].centroid_index);
  }
  console.log(abc);
}

function kmeansAlgo(datapoints, k) {
  let unchanged = false;
  let centroids = get_random_centroids(datapoints, k);
  let centroids_boolean = [[centroids], unchanged];

  datapoints = assign_datapoints_to_centroids(datapoints, centroids, euclid);
  centroids_boolean = calculate_new_centroids(datapoints, centroids, mean);
  unchanged = centroids_boolean.centroids_unchanged;

  let temp = 0;

  while (unchanged === false) {
    datapoints = assign_datapoints_to_centroids(
      datapoints,
      centroids_boolean.centroids,
      euclid
    );
    centroids_boolean = calculate_new_centroids(
      datapoints,
      centroids_boolean.centroids,
      mean
    );
    unchanged = centroids_boolean.centroids_unchanged;
    if (temp === 100) {
      unchanged = true;
    }
    temp += 1;
  }

  // Calculate significance scores using PageRank
  //let significanceScores = calculatePageRank(datapoints);

  // Assign significance scores to datapoints
  //for (let i = 0; i < datapoints.length; i++) {
  //datapoints[i].significance_score = significanceScores[i];
  //}

  // Calculate PageRank scores for the datapoints
  datapoints = calculatePageRank(datapoints, 0.85, 0.001);

  return datapoints;
}

/**
 * Calculates the mean for x and y of the given data points.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate measure on, whereas the array contains the data points; centroid_index is not needed here, but is part of the default data structure
 * @returns {{x, y}} - the measure (here: mean)
 */
function mean(datapoints) {
  let sumX = 0;
  let sumY = 0;
  let datapoints_length = 0;
  for (let i = 0; i < datapoints.length; i++) {
    sumX += datapoints[i].x;
    sumY += datapoints[i].y;
    if (datapoints[i].x !== 0) {
      datapoints_length += 1;
    }
  }

  let x = sumX / datapoints_length;
  let y = sumY / datapoints_length;
  return { x, y };
}

/**
 * Calculates the median for x and y of the given data points.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate measure on, whereas the array contains the data points; centroid_index is not needed here, but is part of the default data structure
 * @returns {{medianX, medianY}} - the measure (here: median)
 */
function median(datapoints) {
  // Extract x and y values from data points
  const xValues = datapoints.map((point) => point.x);
  const yValues = datapoints.map((point) => point.y);

  // Sort x and y values separately
  const sortedX = xValues.sort((a, b) => a - b);
  const sortedY = yValues.sort((a, b) => a - b);

  // Calculate the median for x and y
  const medianX = calculateMedianValue(sortedX);
  const medianY = calculateMedianValue(sortedY);

  // Return the calculated median
  return { medianX, medianY };
}

function calculateMedianValue(sortedArray) {
  const length = sortedArray.length;
  const middleIndex = Math.floor(length / 2);

  if (length % 2 === 0) {
    // If the length is even, average the two middle values
    const value1 = sortedArray[middleIndex - 1];
    const value2 = sortedArray[middleIndex];
    return (value1 + value2) / 2;
  } else {
    // If the length is odd, return the middle value
    return sortedArray[middleIndex];
  }
}

/**
 * Calculates the euclidian distance between two points in space.
 *
 * @param {{ x, y, centroid_index }} point1 - first point in space
 * @param {{ x, y}} point2 - second point in space
 * @returns {distance} - the distance of point1 and point2
 */
function euclid(point1, point2) {
  let distance = Math.sqrt(
    (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
  );
  return distance;
}

/**
 * Calculates the manhattan distance between two points in space.
 *
 * @param {{ x, y, centroid_index }} point1 - first point in space
 * @param {{ x, y, centroid_index }} point2 - second point in space
 * @returns {Number} - the distance of point1 and point2
 */
function manhattan(point1, point2) {
  // TODO
  return 0;
}

/**
 * Assigns each data point according to the given distance function to the nearest centroid.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all available data points
 * @param {[{ x, y }, ... ]} centroids - current centroids
 * @param {Function} distance_function - calculates the distance between positions
 * @returns {[{ x, y, centroid_index }, ...]} - data points with new centroid-assignments
 */
function assign_datapoints_to_centroids(
  datapoints,
  centroids,
  distance_function
) {
  let count = 0;
  for (const datapoint of datapoints) {
    let distance = 9999999;
    let step = 0;
    let new_distance = 0;

    for (const centroid of centroids) {
      new_distance = distance_function(datapoint, centroid);
      if (new_distance < distance) {
        distance = new_distance;
        datapoints[count].centroid_index = step;
      }
      step += 1;
    }
    count += 1;
  }
  return datapoints;
}

/**
 * Calculates for each centroid it's new position according to the given measure.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all available data points
 * @param {[{ x, y }, ... ]} centroids - current centroids
 * @param {Function} measure_function - measure of data set (e.g. mean-function, median-function, ...)
 * @returns {{[{ x, y }, ... ], Boolean}} - centroids with new positions, and true of at least one centroid position changed
 */
function calculate_new_centroids(datapoints, centroids, measure_function) {
  let centroids_unchanged = true;
  let step = 0;
  //let new_centroids = [];
  for (let centroid of centroids) {
    let newDatapoints = filteredDatapoints(datapoints, step);
    let new_centroid = measure_function(newDatapoints);

    if (
      Math.abs(centroid.x - new_centroid.x) !== 0 &&
      Math.abs(centroid.y - new_centroid.y) !== 0
    ) {
      centroid.x = new_centroid.x;
      centroid.y = new_centroid.y;
      centroids_unchanged = false;
    }
    step += 1;
  }

  return { centroids, centroids_unchanged };
}

function filteredDatapoints(datapoints, centroid_index) {
  let newDatapoints = [];
  for (const datapoint of datapoints) {
    if (datapoint.centroid_index === centroid_index) {
      newDatapoints.push(datapoint);
    } else {
      newDatapoints.push({
        x: 0,
        y: 0,
        centroid_index: datapoint.centroid_index,
      });
    }
  }
  return newDatapoints;
}
/**
 * Generates random centroids according to the data point boundaries and the specified k.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all available data points
 * @param {Number} k - number of centroids to be generated as a Number
 * @returns {[{ x, y }, ...]} - generated centroids
 */
function get_random_centroids(datapoints, k) {
  let centroids = [];
  let maxValueX = datapoints.reduce(
    (max, point) => Math.max(max, point.x),
    -Infinity
  );
  let minValueX = datapoints.reduce(
    (min, point) => Math.min(min, point.x),
    Infinity
  );
  let maxValueY = datapoints.reduce(
    (max, point) => Math.max(max, point.y),
    -Infinity
  );
  let minValueY = datapoints.reduce(
    (min, point) => Math.min(min, point.y),
    Infinity
  );

  for (let i = 0; i < k; i++) {
    let randX = Math.random() * (maxValueX - minValueX) + minValueX;
    let randY = Math.random() * (maxValueY - minValueY) + minValueY;
    centroids.push({ x: randX, y: randY });
  }
  // centroids.push({x: 40, y: 405});
  // centroids.push({x: 50, y: 440});
  // centroids.push({x: 50, y: 385});
  return centroids;
}

/**
 * Calculates the PageRank scores for the given data points.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - given data points to calculate scores on, whereas the array contains the data points; centroid_index can be anything at the beginning.
 * @param {number} dampingFactor - damping factor for the PageRank algorithm (usually set to 0.85)
 * @param {number} epsilon - convergence threshold for the PageRank algorithm
 * @returns {[{ x, y, centroid_index, score }, ...]} datapoints - returns the datapoints with the calculated PageRank scores
 */

function calculatePageRank(datapoints, dampingFactor, epsilon) {
  const numPoints = datapoints.length;
  const initialScore = 1 / numPoints;
  let scores = Array(numPoints).fill(initialScore);
  let newScores = Array(numPoints).fill(0);
  let delta = epsilon + 1;

  while (delta > epsilon) {
    for (let i = 0; i < numPoints; i++) {
      newScores[i] = calculatePointScore(datapoints, scores, i, dampingFactor);
    }
    delta = calculateDelta(scores, newScores);
    scores = [...newScores];
  }

  for (let i = 0; i < numPoints; i++) {
    datapoints[i].score = scores[i];
  }

  return datapoints;
}

/**
 * Calculates the PageRank score for a single data point.
 *
 * @param {[{ x, y, centroid_index, score }, ...]} datapoints - all data points
 * @param {number[]} scores - PageRank scores of all data points
 * @param {number} pointIndex - index of the current data point
 * @param {number} dampingFactor - damping factor for the PageRank algorithm
 * @returns {number} - the PageRank score for the given data point
 */
function calculatePointScore(datapoints, scores, pointIndex, dampingFactor) {
  let score = 0;
  const numPoints = datapoints.length;

  for (let i = 0; i < numPoints; i++) {
    const datapoint = datapoints[i];
    if (datapoint.centroid_index !== pointIndex) continue;

    const numNeighbors = getNumNeighbors(datapoints, i, pointIndex);
    if (numNeighbors === 0) continue;

    score += scores[i] / numNeighbors;
  }

  const dampingTerm = dampingFactor * score;
  const teleportationTerm = (1 - dampingFactor) / numPoints;

  return dampingTerm + teleportationTerm;
}

/**
 * Calculates the number of neighbors for a data point.
 *
 * @param {[{ x, y, centroid_index }, ...]} datapoints - all data points
 * @param {number} pointIndex - index of the current data point
 * @param {number} centroidIndex - index of the centroid to consider as neighbors
 * @returns {number} - the number of neighbors for the given data point
 */
function getNumNeighbors(datapoints, pointIndex, centroidIndex) {
  let count = 0;

  for (let i = 0; i < datapoints.length; i++) {
    if (i === pointIndex) continue;
    if (datapoints[i].centroid_index === centroidIndex) count++;
  }

  return count;
}

/**
 * Calculates the delta value for convergence check between two sets of PageRank scores.
 *
 * @param {number[]} scores1 - first set of PageRank scores
 * @param {number[]} scores2 - second set of PageRank scores
 * @returns {number} - the delta value between the two sets of scores
 */
function calculateDelta(scores1, scores2) {
  let delta = 0;

  for (let i = 0; i < scores1.length; i++) {
    delta += Math.abs(scores1[i] - scores2[i]);
  }

  return delta;
}
