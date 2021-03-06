
/*
1.β get state from user, and reformat to: lowercase, underscore instead of space
2.β Make a fetch request 
*/

//GENERAL FUNCTIONS
function createEl(tag) {
  return document.createElement(tag)
}

function unique (array) {
  return[...new Set(array)]
}

//GLOBAL VARIABLES:
let main = document.querySelector(`main`)

let citiesCreated = []

let state = {
  userInput: "",
  breweries: [],
  filters: {
    type: "",
    name: "",
    cities: []
  }
}

//WHERE EVERYTHING STARTS:
function renderPage() {
  let searchFromUser
  const stateSearchFormEl = document.querySelector("#select-state-form")
  // console.log(stateSearchFormEl)
  const stateToSearchInputEl = document.querySelector("#select-state")
  // console.log(stateToSearchInputEl)
  
  //ππ»HERE IS THE FORM WITH THE FETCH-STATE
  stateSearchFormEl.addEventListener("submit", function (e) {
    e.preventDefault()
    let userInput = stateToSearchInputEl.value
    userInput = userInput.toLowerCase().replace(" ", "_")
    searchFromUser = userInput
    state.userInput = userInput
    // console.log(`User Input: `, userInput)
    console.log(`state.userInput: `, state.userInput)
    
    //***FETCH WITH FILTER***
    getUSBreweriesByStateFromServer(searchFromUser)
    //WE GIVE NAME TO JS-DATA FROM SERVER SO WE CAN USE IT:
    //INSIDE HERE I CAN GUARANTEE THE BREWERIES ARE BACK, SO I CAN FILTER BY TYPE AND STORE THEM:
    .then(function(breweriesFromServer) {
      let filteredBreweries = breweriesFromServer.filter(function(brewery){
        return brewery.brewery_type === "brewpub" || 
               brewery.brewery_type === "regional" || 
               brewery.brewery_type === "micro"
      })
      state.breweries = filteredBreweries
      // console.log(`State.breweries after fetch filtered by type: `, state.breweries)
      
      stateSearchFormEl.reset()

      createAsideEl() 
      createSearchFormMain()  
      createListOfBreweries(state.breweries)
    })
  })
}

//SYNTAX: https://api.openbrewerydb.org/breweries?per_page=25 // we want more than 10 cities to filter later
//f FETCH FROM SERVER
function getUSBreweriesByStateFromServer (userStateInput) {
  return fetch(`https://api.openbrewerydb.org/breweries?by_state=${userStateInput}&per_page=50`)
  .then(function (response) {
    // console.log(response)
    return response.json() //trasform json-data into js-data (obj)
  })
}

function createAsideEl () {
   
   let  asideSectionEl = createEl(`aside`)
   asideSectionEl.setAttribute(`class`, `filters-section`)
   
   let h2FilterTitleEl = createEl(`h2`)
   h2FilterTitleEl.innerText = "Filter by:"

   let filterFormEl = createEl(`form`)
   filterFormEl.setAttribute(`id`, `filter-by-type-form`)
   filterFormEl.setAttribute(`autocomplete`, `off`)

   let labelFilterByTypeEl = createEl(`label`)
   labelFilterByTypeEl.setAttribute(`for`, `filter-by-type`)
   let labelTitleEl = createEl(`h3`)
   labelTitleEl.innerText = "Type of Brewery"

   let selectEl = createEl(`select`)
   selectEl.setAttribute(`name`, `filter-by-type`)
   selectEl.setAttribute(`id`, `filter-by-type`)


  // ππ» EVENT LISTENER BY TYPE
  selectEl.addEventListener(`change`, function(){
    // console.log(`selectEl.target.value: `, selectEl.value)
    state.filters.type = selectEl.value
    createListOfBreweries(state.breweries)
  })


   let optionSelectATypeEl = createEl(`option`)
   optionSelectATypeEl.setAttribute(`value`, `""`)

   optionSelectATypeEl.innerText = "Select a type..."

   let optionMicroEl = createEl(`option`)
   optionMicroEl.setAttribute(`value`, `micro`)
   optionMicroEl.innerText = "Micro"
   
   let optionReginalEl = createEl(`option`)
   optionReginalEl.setAttribute(`value`, `regional`)
   optionReginalEl.innerText = "Regional"

   let optionBrewpub = createEl(`option`)
   optionBrewpub.setAttribute(`value`, `brewpub`)
   optionBrewpub.innerText = "Brewpub"

   let divFilterByCityEl = createEl(`div`)
   divFilterByCityEl.setAttribute(`class`, `filter-by-city-heading`)

   let h3TitleCitiesEl = createEl(`h3`)
   h3TitleCitiesEl.innerText = `Cities`

   let btnClearAllEl = createEl(`button`)
   btnClearAllEl.setAttribute(`class`, `clear-all-btn`)
   btnClearAllEl.innerText = `Clear all`
   
   
   let formFilterByCityEl = createEl(`form`)
   formFilterByCityEl.setAttribute(`id`, `filter-by-city-form`)
   formFilterByCityEl.setAttribute(`name`, `filter-city-form`)

   
   main.append(asideSectionEl)
   asideSectionEl.append(h2FilterTitleEl, filterFormEl, divFilterByCityEl, formFilterByCityEl)
   labelFilterByTypeEl.append(labelTitleEl)
   filterFormEl.append(labelFilterByTypeEl, selectEl)
   selectEl.append(optionSelectATypeEl, optionMicroEl, optionReginalEl, optionBrewpub)
   divFilterByCityEl.append(h3TitleCitiesEl, btnClearAllEl)
   //  formFilterByCityEl.append(inputCheckboxEl, labelCityEl)
   //  console.log(asideSectionEl)
  
   //π«FOR-LOOP HERE β¬β¬β¬ 
   renderCitiesInAside(state.breweries) //In here bc here it renders after El is created
}

function renderCitiesInAside() {
  let formFilterByCityEl = document.querySelector("#filter-by-city-form")
  formFilterByCityEl.innerHTML = ""
  
  //ALL CITIES IN BREWERIES FROM THE FETCH
  const repeatedCities = state.breweries.map(function (brewery) {
    return brewery.city})
  
  //NO REPETIION + A-Z ORDER
  const uniqueCities = unique(repeatedCities)
  const sortedCities = uniqueCities.slice().sort()
  
  for (const city of sortedCities) {
    const cityToRender = !citiesCreated.includes(city)
    if (cityToRender) { //if that's true, then:
      citiesCreated.push(city) //push that city into citiesCreated.
    
    let inputCheckboxEl = createEl(`input`)
    inputCheckboxEl.setAttribute(`type`, `checkbox`)
    inputCheckboxEl.setAttribute(`name`, city) 
    inputCheckboxEl.setAttribute(`value`, city) 

    //EVENT LISTENER CHECKBOX
    inputCheckboxEl.addEventListener(`change`, function(e) {
      console.log(e)
      let cityClicked = e.target.value
      console.log(`checkbox clicked(city): `, cityClicked)
      
      if (!state.filters.cities.find(element => element === cityClicked)) {
        state.filters.cities.push(cityClicked)
        console.log(`state.filters.cities con cityClicked`, state.filters.cities)
        
        // let CitiesNoDoubles = unique(state.filters.cities)
        // //   CitiesNoDoubles = CitiesNoDoubles.sort()
          
        //   state.filters.cities = CitiesNoDoubles
        //   console.log(`state.filters.cities NOW: `, state.filters.cities)

          let breweriesToRender = state.breweries;
          
          if (state.filters.cities.length > 0) {
            // code here depends on filter cities
            breweriesToRender = breweriesToRender.filter(function (brewery) {
              return state.filters.cities.includes(brewery.city);
            })
            createListOfBreweries(breweriesToRender)
          }
          
      } else {
            let breweriesToRender = state.breweries;

            state.filters.cities = state.filters.cities.filter(element => element !== cityClicked) 
            console.log(state.filters.cities)
            if (state.filters.cities.length > 0) {
              // code here depends on filter cities
              breweriesToRender = breweriesToRender.filter(function (brewery) {
                return state.filters.cities.includes(brewery.city);
              })
              createListOfBreweries(breweriesToRender)
            } else {
              createListOfBreweries(state.breweries)
            }

          }
        } //event listener
      )


      let labelCityEl = createEl(`label`)
      labelCityEl.setAttribute(`for`, city) 
      labelCityEl.setAttribute(`name`, city) 
      labelCityEl.setAttribute(`value`, city) 
      labelCityEl.innerText = city

      formFilterByCityEl.append(inputCheckboxEl, labelCityEl)
    }//if
  }//for loop
}//function


//-------------------------------------------------------------------------------

//FILTER words/name TO DO: π§Ύπ 
function createSearchFormMain() {
  let h1ListSectionEl = createEl(`h1`)
  h1ListSectionEl.innerText = "List of Breweries"

  let headerEl = createEl(`header`)
  headerEl.setAttribute(`class`, `search-bar`)

  let formHeader = createEl(`form`)
  formHeader.setAttribute(`id`, `search-breweries-form`)
  formHeader.setAttribute(`autocomplete`, `off`)

  let labelSearchHeader = createEl(`label`)
  labelSearchHeader.setAttribute(`for`, `search-breweries`)

  let h2LabelSearchHeaderEl = createEl(`h2`)
  h2LabelSearchHeaderEl.innerText = `Search breweries:`

  let inputSearchHeaderEl = createEl(`input`)
  inputSearchHeaderEl.setAttribute(`id`, `search-breweries`)
  inputSearchHeaderEl.setAttribute(`name`, `search-breweries`)
  inputSearchHeaderEl.setAttribute(`type`, `text`)

  //HERE f for the INPUT WITH any-word-written by user to filter in DATA-------------// TO DO: π§Ύπ

  let articleListEl = createEl(`article`)

  let ulListOfBreweries = createEl(`ul`)
  ulListOfBreweries.setAttribute(`class`, `breweries-list`)

  main.append(h1ListSectionEl, headerEl, articleListEl)
  headerEl.append(formHeader)
  formHeader.append(labelSearchHeader, inputSearchHeaderEl)
  labelSearchHeader.append(h2LabelSearchHeaderEl)
  articleListEl.append(ulListOfBreweries)
}
//-------------------------------------------------------------------------------
function createListOfBreweries(breweries) {
  // RESET THE LIST OF PREVIOUS SEARCHES:
  let ulListOfBreweries = document.querySelector(`.breweries-list`)
  ulListOfBreweries.innerHTML = ""
  
  //π« FOR LOOP:
  for (const brewery of breweries) { //brew is the entire obj
    if (state.filters.type === brewery.brewery_type || state.filters.type === ""){
      //so here I have access to EACH OBJ of EACH BREWERY, for every cycle of the loop:
      create1BrewOfBreweries(brewery) 
      // console.log(brewery)
    } else {
      continue
    }
  } 
  // WE WANT TO RENDER ONYL 10 BREWERIES PER PAGE:
  let slicedBreweries = breweries.slice(0, 10)
  // console.log(`breweries rendered`, slicedBreweries)
}

// this is inside createListofBreweries()
function create1BrewOfBreweries(brewery) {

  let ulListOfBreweries = document.querySelector(`.breweries-list`)

  let liBreweryEl = createEl(`li`)

  let h2BrewName = createEl(`h2`)
  h2BrewName.innerText = brewery.name

  let divBrewType = createEl(`div`)
  divBrewType.setAttribute(`class`, `type`)
  divBrewType.innerText = brewery.brewery_type
  
  //SECTION BREW ADDRESS
  let sectionBrewAddressEl = createEl(`section`)
  sectionBrewAddressEl.setAttribute(`class`, `address`)

  let h3BrewAddress = createEl(`h3`)
  h3BrewAddress.innerText = "Address:"

  let pRoadAddressBrew = createEl(`p`)
  pRoadAddressBrew.innerText = brewery.street

  let pBrewAddressWithStrongCityAndZip = createEl(`p`)

  let strongPartBrewAddressCityAndZip = createEl(`strong`)
  strongPartBrewAddressCityAndZip.innerText = brewery.city + ", " + brewery.postal_code

  //SECTION BREW Phone
  let sectionBrewPhone = createEl(`section`)
  sectionBrewPhone.setAttribute(`class`, `phone`)

  let h3PhoneTitle = createEl(`h3`)
  h3PhoneTitle.innerText = "Phone:"

  let pBrewPhone = createEl(`p`)
  pBrewPhone.innerText = brewery.phone
  
  //SECTION BREW LINK
  let sectionBrewLink = createEl(`section`)
  sectionBrewLink.setAttribute(`class`, `link`)

  let aElBrewWebsite = createEl(`a`)
  aElBrewWebsite.setAttribute(`href`, brewery.website_url)
  aElBrewWebsite.setAttribute(`target`, `_blank`)
  aElBrewWebsite.setAttribute(`href`, brewery.website_url)
  aElBrewWebsite.innerText = "Visit Website"

  
  liBreweryEl.append(h2BrewName, divBrewType, sectionBrewAddressEl, sectionBrewPhone, sectionBrewLink)
  sectionBrewAddressEl.append(h3BrewAddress, pRoadAddressBrew, pBrewAddressWithStrongCityAndZip)
  pBrewAddressWithStrongCityAndZip.append(strongPartBrewAddressCityAndZip)
  sectionBrewPhone.append(h3PhoneTitle, pBrewPhone)
  sectionBrewLink.append(aElBrewWebsite)
  ulListOfBreweries.append(liBreweryEl)
}

//-------------------------------------------------------------------------------

renderPage()
