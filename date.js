
exports.getDate = function(){

  const today = new Date();

  const options = {
    day: "numeric",
    weekday: "long",
    month: "long"
  };

  return today.toLocaleDateString("en-GB", options);


  }

exports.getDay = function(){

    const today = new Date();

    const options = {
      weekday: "long",
    };

    return today.toLocaleDateString("en-GB", options);

    }
