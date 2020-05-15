// import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete'
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map'


let input = document.getElementById('address')
let lat = document.getElementById('lat')
let lng = document.getElementById('lng')


typeAhead( $('.search'))

autocomplete( input, lat, lng)

makeMap( $('#map') )
