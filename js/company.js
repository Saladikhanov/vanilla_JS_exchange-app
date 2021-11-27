const titleText = window.location.search.replace("?symbol=", "");
const bouncer = document.getElementById("bouncer");
console.log(titleText);
let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${titleText}`;
let stockPriceHistory = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${titleText}?serietype=line`;
bouncer.classList.add("bouncer");
bouncer.classList.remove("nobouncer");
fetch(url)
  .then((response) => response.json())
  .then(
    (data) => {
      setTimeout(() => {
        bouncer.classList.remove("bouncer");
        bouncer.classList.add("nobouncer");
        const pageWrapper = document.getElementById("pageWrapper");
        console.log(data);

        const companyLogo = document.createElement("img");
        companyLogo.classList.add("companyPageImg");
        companyLogo.src = data.profile.image;
        companyLogo.onerror = function () {
          companyLogo.src = "../img/no_logo.png";
        };

        const companyPage = document.createElement("div");
        companyPage.classList.add("companyPageName");
        companyPage.textContent = data.profile.companyName;

        const stockPrice = document.createElement("div");
        stockPrice.classList.add("stockPrice");
        stockPrice.textContent = `$ ${data.profile.price}`;

        const stockPercentage = document.createElement("div");
        stockPercentage.classList.add("stockPercentage");
        stockPercentage.textContent = data.profile.changesPercentage;

        if (data.profile.changesPercentage > 0) {
          stockPercentage.classList.remove("stockPercentage");
          stockPercentage.classList.add("stockPercentagePositive");
          stockPercentage.textContent = `+ ${data.profile.changesPercentage}`;
        } else if (data.profile.changesPercentage < 0) {
          stockPercentage.classList.remove("stockPercentage");
          stockPercentage.classList.add("stockPercentageNegative");
        }

        const companyHistory = document.createElement("div");
        companyHistory.classList.add("companyPageHistory");
        companyHistory.textContent = data.profile.description;

        const companyLink = document.createElement("a");
        companyLink.href = data.profile.website;
        companyLink.classList.add("companyPageLink");
        companyLink.textContent = data.profile.website;

        pageWrapper.append(
          companyLogo,
          companyPage,
          stockPrice,
          stockPercentage,
          companyHistory,
          companyLink
        );
      });
    },
    [1000]
  );

const dateArray = [];
const closeArray = [];
fetch(stockPriceHistory)
  .then((response) => response.json())
  .then((data) => {
    for (let a = 0; a < 30 - 1; a++) {
      //magic array pushing goes here
      dateArray.push(data.historical[a].date);
      closeArray.push(data.historical[a].close);
    }
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dateArray.reverse(),
        datasets: [
          {
            label: "Price over dates",
            data: closeArray.reverse(),

            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 5,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
