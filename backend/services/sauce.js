function updateSauce(sauceObject) {
  return new Promise((resolve, reject) => {
    Sauce.updateOne({ _id: sauceObject._id }, sauceObject)
      .then(resolve)
      .catch(reject);

      // SQL UPDATE TRUC
  });
}

function updateSauce2(sauceObject) {
  return Sauce.updateOne({ _id: sauceObject._id }, sauceObject);
}


module.exports = {
  updateSauce,
} 