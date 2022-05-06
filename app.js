document.onreadystatechange = function () {
  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};

const fdGetRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    client.request.get(url, options).then(
      (data) => resolve(data),
      (err) => reject(err)
    );
  });
};

function disableProp(data) {
  client.interface
    .trigger("hide", { id: "status" })
    .then(function (data) {
      // data - success message
    })
    .catch(function (error) {
      // error - error object
    });
}

function userInfo() {
  client.data.get("loggedInUser").then (
    function(data) {
    console.log("LOGIN INFO >>>", data)
    },
    function(error) {
     
    }
    );
}

function onAppActivate() {
  var textElement = document.getElementById("apptext");
  var getContact = client.data.get("contact");
  getContact.then(showContact).catch(handleErr);

  async function showContact(payload) {
    console.log("rrr", payload);

    

    const getTicketProperty = async () => {
      var headers = {
        Authorization: "Basic <%= encode(iparam.apiKey) %>",
        "Content-Type": "application/json",
      };
      var options = { headers: headers };

      var url = `https://spritle2175.freshdesk.com/api/v2/admin/ticket_fields`;
      const { response } = await fdGetRequest(url, options);

      const convData = JSON.parse(response);
      console.log("TICKET PROPERTY >>>", convData);

      return convData;
    };
    const data=await getTicketProperty();
    console.log("RESULT >>>", data)
    disableProp(data);
  }
  userInfo();
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
