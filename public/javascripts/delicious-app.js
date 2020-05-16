// import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete'
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map'
import ajaxHeart from './modules/heart'


let input = document.getElementById('address')
let lat = document.getElementById('lat')
let lng = document.getElementById('lng')


typeAhead( $('.search'))

autocomplete( input, lat, lng)

makeMap( $('#map') )

const heartForms = $$('form.heart')
heartForms.on('submit', ajaxHeart)
