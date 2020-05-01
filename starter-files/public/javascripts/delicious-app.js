import '../sass/style.scss';

// import { $, $$ } from './modules/bling';
// import autocomplete from './modules/autocomplete'



let input = document.getElementById('address')
let lat = document.getElementById('lat')
let lng = document.getElementById('lng')

console.log(input)


function autocomplete(input, latInput, lngInput) {
    if(!input) return
    const dropdown = new google.maps.places.Autocomplete(input)

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace()
        latInput.value = place.geometry.location.lat()
        lngInput.value = place.geometry.location.lng()
    })
    input1.addEventListener('keydown', (e) => {
        if(e.keyCode === 13) e.preventDefault()
    })
    
}


autocomplete( input, lat, lng)

