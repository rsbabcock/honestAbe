const params = (res,fk) => res.map(r => `${fk}=${r.id}`).join("&")

const unique = function* (arr, prop) {
    const map = new Map()
    let i = 0

    while (i < arr.length) {
        const key = arr[i][prop]
        if (!map.has(key) && map.set(key, 1)) yield arr[i]
        i++
    }
}

const allPoliticians = []

const politician = (id, name) => {
    return {
        id: id,
        name: `${name}`,
        bills: [],
        relatedPacs: []
    }
}


/*
    GOAL
    ----------------
    Display an HTML representation for EVERY politician showing
    the bills they have sponsored and any PACs that share interest
    with their sponsored bills
*/

// Get a politician
$.ajax("http://localhost:8088/politicians/")

    // Query legislation the politician has sponsored
    .then(politicians => {
        const promises = []


        politicians.forEach(p => {
            // Generate a politician object
            const currentPolitician = politician(p.id, p.name)

            // Push politician object into bucket
            allPoliticians.push(currentPolitician)

            // Query the API for all bills that the current politician sponsored
            promises.push($.ajax(`http://localhost:8088/billPolitician?politicianId=${p.id}&_expand=bill`) )
        })

        return Promise.all(promises)

    })

    .then(allThePromises => {
        allThePromises.forEach(legislationArray => {
            // i need to get out the bill title and push it into the correct politician
            legislationArray.forEach(l => {
                // debugger
                const foundIt = allPoliticians.find(p => {
                    return p.id === l.politicianId
                })
                foundIt.bills.push(l.bill)
            })
        })


        console.log(allPoliticians)

        allPoliticians.forEach(p => {
            // debugger
            const profile = `
                <article class="politician">
                    <header class="politician__name">
                        <h1>${p.name}</h1>
                    </header>
                    <section class="politician__bills">
                        <h3>Sponsored Bills</h3>
                        <ol>
                        ${p.bills.map(b => `<li>${b.title}</li>`).join("")}
                        </ol>
                        </section>
                        </article>
                        `
                        document.querySelector("#output").innerHTML += profile
                    })
                })
                
                // ${p.bills.map(b => `<li>${b.title}</li>`).join("")}