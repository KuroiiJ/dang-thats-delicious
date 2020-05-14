import axios from 'axios'
import dompurify from 'dompurify'

function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
        <a href="/stores/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
        </a>
        `
    }).join('')
}

function typeAhead(search) {
    if(!search) return

    const searchInput = search.querySelector('input[name="search"]')
    const searchResults = search.querySelector('.search__results')
    console.log(searchInput, searchResults)

    searchInput.addEventListener('input', function() {
        if(!this.value) {
            searchResults.style.display = "none"
            return
        }

        searchResults.style.display = "block"
        searchResults.innerHTML = ''


        axios
        .get(`/api/search?q=${this.value}`)
        .then(res => {
            console.log(res.data)
          if (res.data.length) {
            // results html
            searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data))
            return
          } 
          // tell use nothing came back
          searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for <strong>${this.value}</strong> found!</div>`)
        })
        .catch(err => {
          console.log('ERROR: ', err)
        })
    })


    //navigating dropdown with keys
    searchInput.on('keyup', (e) => {
        //if they aren't pressing up down or enter whatev
        if (![38, 40, 13].includes(e.keyCode)) {
            return 
        }
        const activeClass = 'search__result--active'
        const current = search.querySelector(`.${activeClass}`)
        // list all items
        const items = search.querySelectorAll('.search__result')
        let next
        if (e.keyCode === 40 && current) {
          next = current.nextElementSibling || items[0]
        } else if (e.keyCode === 40) {
          next = items[0]
        } else if (e.keyCode === 38 && current) {
          next = current.previousElementSibling || items[items.length - 1]
        } else if (e.keyCode === 38) {
          next = items[items.length - 1]
        } else if (e.keyCode === 13 && current.href) {
          window.location = current.href
          return
        }
        if(current) {
            current.classList.remove(activeClass)
        }
        next.classList.add(activeClass)
    })
}


export default typeAhead