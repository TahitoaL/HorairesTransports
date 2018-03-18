import {createNotification} from './notification.js'
import css from '../css/app.scss'

var dev = process.env.NODE_ENV == "development"

var get = function(url) {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(xhr)
        }
      }
    }
    xhr.open('GET', url, true)
    xhr.send()
  })
}

var getRequest = async function () {
  var response = await get('https://toal.000webhostapp.com/transports/contents/horaires.php')
  let ret = JSON.parse(response)
  return ret
}

var getUris = async function (sens) {
  let horaires = await getRequest()
  let times = {}
  times.rer = []
  times.bus = []
  times.metro = []
  horaires.forEach(function (horaire) {
    if (horaire.type == "RER" && sens == horaire.trajet) {
      times.rer.push('https://toal.000webhostapp.com/transports/contents/horaire_ajax_rer.php?ligne=' + horaire.ligne + '&station=' + horaire.station + '&sens=' + horaire.sens)
    } else if (horaire.type == "BUS" && sens == horaire.trajet) {
      times.bus.push('https://toal.000webhostapp.com/transports/contents/horaire_ajax_bus.php?ligne=' + horaire.ligne + '&station=' + horaire.station + '&sens=' + horaire.sens)
    } else if (horaire.type == "METRO" && sens == horaire.trajet) {
      times.metro.push('https://toal.000webhostapp.com/transports/contents/horaire_ajax_metro.php?ligne=' + horaire.ligne + '&station=' + horaire.station + '&sens=' + horaire.sens)
    }
  })
  console.log('fin de la création')
  return times
}

var getSchedules = async function (sens) {
  let response = await getUris(sens)
  response.rer.forEach(async function (url) {
    let schedule = await get(url)
    console.log(schedule)
  })
  response.bus.forEach(async function (url) {
    let schedule = await get(url)
    console.log(schedule)
  })
  response.metro.forEach(async function (url) {
    let schedule = await get(url)
    console.log(schedule)
  })
  createNotification('success', 'Les requetes ont été effectuées avec succès')
  return response
}

getSchedules('0').then(function (results) {
  console.log(results)
})

document.querySelectorAll('button').forEach(function (button) {
  button.addEventListener('click', function (e) {
    e.preventDefault()
    console.log('Bonjour les enfants')
    createNotification(this.getAttribute('data-notification-type'), this.getAttribute('data-notification-text') == undefined ? this.innerHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : this.getAttribute('data-notification-text'))
  })
})
