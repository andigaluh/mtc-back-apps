customFormatDate = (data) => {
  var today = new Date(data),
    month = "" + (today.getMonth() + 1),
    day = "" + today.getDate(),
    year = today.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

customDate = {
  customFormatDate,
};

module.exports = customDate;
