
/*
1. ✔ get state from user, and reformat to: lowercase, underscore instead of space
2.✔Make a fetch request 
*/
//GLOBAL VARIABLES:
let main = document.querySelector(`main`)
//FUNCTION TO CREATE HTML EL
function createEl(tag) {
  return document.createElement(tag)
}

let state = {
  breweries: []
}

//WHERE EVERYTHING STARTS:
//here is *the fetch*
//and all the functions to render the pg and its searches
function renderPage() {
  let searchFromUser
  const stateSearchFormEl = document.querySelector("#select-state-form")
  // console.log(stateSearchFormEl)
  const stateToSearchInputEl = document.querySelector("#select-state")
  // console.log(stateToSearchInputEl)
  
  //HERE IS THE FORM WITH THE FETCH-STATE
  stateSearchFormEl.addEventListener("submit", function (e) {
    e.preventDefault()
    let userInput = stateToSearchInputEl.value
    userInput = userInput.toLowerCase().replace(" ", "_")
    searchFromUser = userInput
    // console.log(`User Input: `, userInput)

    console.log(`Search from User: `, searchFromUser)
    fetchFunc(searchFromUser) //here we give a name to the data js received from the server
    //here, after f fetchFunc, we have the STATE FILL with the list of breweries requested
    createListOfBreweries(state.breweries) //article with Ul and f to create the Li of each Brewery
    // state.breweries.forEach(el => console.log(el));

  })
  
  createAsideInMain() //need all cities names from server or hardcoded???
  createGeneralFormSearchInMain() //user searches for words/name 
}

//FUNCTION TO FETCH FROM SERVER
function fetchFunc (userStateInput) {

  
  return fetch(`https://api.openbrewerydb.org/breweries?by_state=${userStateInput}`)
  .then(function (res) {
    // console.log(res)
    return res.json() //trasform json-data into js-data (obj)
  })
  .then( function(data) {
    // console.log(`This is data not in the state yet: `, data) //here we have the data in js-obj
    state.breweries = data
      console.log(`This is my state now: `, state.breweries)
    // state.breweries.forEach(el => console.log(el));

    })
}

//QUESTION:
//in che checkboxes, we need all cities' names from server or hardcoded???
//this function creates the ASIDE 
//NEEDS: the filters by cities 
function createAsideInMain () {
   
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

   let inputCheckboxEl = createEl(`input`)
   inputCheckboxEl.setAttribute(`type`, `checkbox`)
   inputCheckboxEl.setAttribute(`name`, ``) //here there will be the value NAME OF THE CITY
   inputCheckboxEl.setAttribute(`value`, ``) 

   let labelCityEl = createEl(`label`)
   labelCityEl.setAttribute(`for`, ``) //same of the CITY NAME
   
   main.append(asideSectionEl)
   asideSectionEl.append(h2FilterTitleEl, filterFormEl, divFilterByCityEl, formFilterByCityEl)
   labelFilterByTypeEl.append(labelTitleEl)
   filterFormEl.append(labelFilterByTypeEl, selectEl)
   selectEl.append(optionSelectATypeEl, optionMicroEl, optionReginalEl, optionBrewpub)
   divFilterByCityEl.append(h3TitleCitiesEl, btnClearAllEl)
   formFilterByCityEl.append(inputCheckboxEl, labelCityEl)

  //  console.log(asideSectionEl)
}

//here user searches for words/name
function createGeneralFormSearchInMain() {
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

  //HERE f for the INPUT WITH DATA TO FILTER -----------------------------------

  main.append(h1ListSectionEl, headerEl)
  headerEl.append(formHeader)
  formHeader.append(labelSearchHeader, inputSearchHeaderEl)
  labelSearchHeader.append(h2LabelSearchHeaderEl)
}

function createListOfBreweries(breweries) {

  let articleListEl = createEl(`article`)

  let ulListOfBreweries = createEl(`ul`)
  ulListOfBreweries.setAttribute(`class`, `breweries-list`)

  main.append(articleListEl)
  articleListEl.append(ulListOfBreweries)

  // state.breweries.forEach(el => console.log(el));

  for (const brewery of breweries) { //brew is the entire obj
    //so here I have access to EACH OBJ of EACH BREWERY, every cycle of the loop
    create1BrewOfBreweries(brewery) 
    console.log(brewery)
  }
}

// this is inside createListofBreweries()
function create1BrewOfBreweries(brewery) {

  //for loop needed here
  let ulListOfBreweries = querySelector(`.breweries-list`)

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
  aElBrewWebsite.innerText = "Visit Website"

  
  liBreweryEl.append(h2BrewName, divBrewType, sectionBrewAddressEl, sectionBrewPhone, sectionBrewLink)
  sectionBrewAddressEl.append(h3BrewAddress, pRoadAddressBrew, pBrewAddressWithStrongCityAndZip)
  pBrewAddressWithStrongCityAndZip.append(strongPartBrewAddressCityAndZip)
  sectionBrewPhone.append(h3PhoneTitle, pBrewPhone)
  sectionBrewLink.append(aElBrewWebsite)
  ulListOfBreweries.append(liBreweryEl)
}

renderPage()
