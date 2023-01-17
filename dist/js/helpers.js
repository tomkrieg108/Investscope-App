export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    //include a timeout check too
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching: ${url} - ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error in getJSON(): ${err}`);
    throw err;
  }
};

export const sendJSON = async function (url, dataUpload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUpload),
  };

  try {
    console.log("call fetch() to send data", url, dataUpload);
    const response = await fetch(url, options);
    //console.log(response);
    if (!response.ok)
      throw new Error(
        `There was a problem creating data: ${url} - ${response.status}`
      );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const updateJSON = async function (url, dataUpload) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataUpload),
  };

  try {
    const response = await fetch(url, options);
    console.log(response);
    if (!response.ok)
      throw new Error(
        `There was a problem updating data: ${url} - ${response.status}`
      );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const deleteJSON = async function (url) {
  const options = {
    method: "DELETE",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify(dataUpload),
  };

  try {
    console.log("deleting url: ", url);
    const response = await fetch(url, options);
    console.log(response);
    if (!response.ok)
      throw new Error(
        `There was a problem deleting data: ${url} - ${response.status}`
      );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
