const urlTopLine = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse`;
const marquee = document.getElementById("marqueeDiv");

fetch(urlTopLine)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i <= 30; i++) {
      const marqueeName = document.createElement("span");
      marqueeName.classList.add("marqueeName");
      marqueeName.textContent = data[i].symbol;

      const marqueePrice = document.createElement("span");
      marqueePrice.classList.add("marqueePrice");
      marqueePrice.textContent = `$${data[i].price}`;

      marquee.append(marqueeName, marqueePrice);
    }
  });

const formInput = document.getElementById("formInput");
const bouncer = document.getElementById("bouncer");

// Point 1 in Time

const getStocks = () => {
  const userInput = formInput.value;
  console.log(userInput.toUpperCase());
  const stockUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`;

  while (searchResultList.firstChild) {
    searchResultList.removeChild(searchResultList.firstChild);
  }

  // Point 2 in Time
  getStocksButton.disabled = true;
  getStocksButton.textContent = "Loading";
  bouncer.classList.add("bouncer");
  bouncer.classList.remove("nobouncer");

  fetch(stockUrl)
    .then((response) => response.json())
    .then((data) => {
      // Point 3 in Time
      setTimeout(() => {
        getStocksButton.disabled = false;
        getStocksButton.textContent = "Search";
        bouncer.classList.remove("bouncer");
        bouncer.classList.add("nobouncer");
        const searchResultList = document.getElementById("searchResultList");

        for (let i = 0; i <= data.length - 1; i++) {
          const listWrapper = document.createElement("div");
          listWrapper.classList.add("list-wrapper");

          const companyName = document.createElement("a");
          companyName.href = `./html/company.html?symbol=${data[i]["symbol"]}`;
          companyName.textContent = data[i]["name"];
          companyName.classList.add("companyName");

          //--------------- DIV into link--------------//
          const aLink = document.createElement("a");
          aLink.href = `./html/company.html?symbol=${data[i]["symbol"]}`;
          aLink.classList.add("aLink");

          //--------------------------------//
          const companyAbv = document.createElement("a");
          companyAbv.setAttribute("id", "companyCode");
          companyAbv.href = `./html/company.html?symbol=${data[i]["symbol"]}`;
          companyAbv.textContent = data[i]["symbol"];
          companyAbv.classList.add("companyAbv");

          let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companyAbv.textContent}`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              const companyLogo = document.createElement("img");
              companyLogo.classList.add("companyImg");
              companyLogo.src = data.profile.image;
              companyLogo.onerror = function () {
                companyLogo.src = "./img/no_logo.png";
              };
              const stockPercentage = document.createElement("div");
              stockPercentage.classList.add("stockPercentage");
              stockPercentage.classList.add("stockFix");
              stockPercentage.textContent = `${data.profile.changesPercentage.slice(
                0,
                4
              )}%`;

              if (data.profile.changesPercentage > 0) {
                stockPercentage.classList.remove("stockPercentage");
                stockPercentage.classList.add("stockPercentagePositive");
                stockPercentage.textContent = `+ ${data.profile.changesPercentage.slice(
                  0,
                  4
                )}%`;
              } else if (data.profile.changesPercentage < 0) {
                stockPercentage.classList.remove("stockPercentage");
                stockPercentage.classList.add("stockPercentageNegative");
                stockPercentage.textContent = `${data.profile.changesPercentage.slice(
                  0,
                  5
                )}%`;
              }

              listWrapper.append(stockPercentage, companyLogo);
              searchResultList.append(listWrapper);
            });
          listWrapper.append(aLink, companyName, companyAbv);
          searchResultList.append(listWrapper);
        }
      }, [1000]);
    });
};

const getStocksButton = document.getElementById("submitButton");
submitButton.addEventListener("click", getStocks);
