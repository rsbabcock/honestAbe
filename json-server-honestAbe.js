/*// http://localhost:5000/politicianlegislations/1?_expand=politician&_expand=legislation
// http://localhost:5000/politicians/1?_embed=politicianlegislations
// http://localhost:5000/politicians?id=1&id=2
// http://localhost:5000/politicians?q=some_search_string

// Get a politician
$.ajax("http://localhost:5000/politicians/1")

    // Query legislation the politician has sponsored
    .then(politician => {
        return $.ajax(`http://localhost:5000/politicianlegislations?politicianId=${politician.id}`)
    })

    // Query the interests for each sponsored legislation
    .then(bills => {
        const queryParameters = bills.map(b => `legislationId=${b.id}`).join("&")

        return $.ajax(`http://localhost:5000/legislationinterests?${queryParameters}`)
    })

    // Query the PACs who share those interests by using json-server _expand feature
    .then(interests => {
        const queryParameters = interests.map(i => `interestId=${i.id}`).join("&")

        return $.ajax(`http://localhost:5000/pacinterests?${queryParameters}&_expand=pac`)
    })

    // Display the related PACs
    .then(pacs => console.log(pacs)) */

const politicanProfile = {
    name: '',
    bills: [],
    pacs: []
}

// Get a politician
$.ajax("http://localhost:8088/politicians/1")
    // Query legislation the politician has sponsored
    .then(politician => {
        politicanProfile.name = politician.name
        return $.ajax(`http://localhost:8088/billPolitician?politicianId=${politician.id}`)
    })

    // Query the interests for each sponsored legislation
    .then(bill => {
        const queryParameters = bill.map(b => `id=${b.id}`).join("&")

        return $.ajax(`http://localhost:8088/bills?${queryParameters}`)
        debugger
    })

    // Query the PACs who share those interests by using json-server _expand feature
    .then(interests => {
        politicanProfile.bills = interests
        const queryParameters = interests.map(i => `interestId=${i.id}`)
        // .join("&")

        return $.ajax(`http://localhost:8088/pacs?${queryParameters}`)
    })

    // Display the related PACs
    .then(pacs => {
        politicanProfile.pacs = pacs

        console.log(politicanProfile)

            $("#output").append(`
            <h1> ${politicanProfile.name}</h1>
            <p> Bill: ${politicanProfile.bills[0].title}</p>
            <p>PACS: ${politicanProfile.pacs[0].title}</p>
            `)
    })
// debugger