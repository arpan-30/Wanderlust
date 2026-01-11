
    {/* let mapToken=mapToken;
    console.log(mapToken); */}
	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        //  center: [77.1025, 28.7041],
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });

// const el = document.createElement('div');
// el.className = 'custom-marker';

// new mapboxgl.Marker(el)
//   .setLngLat(coordinates)
//   .addTo(map);

// const el = document.createElement('div');
// el.style.backgroundImage = 'url("/assets/house-regular-full.svg")';
// el.style.width = '40px';
// el.style.height = '40px';
// el.style.backgroundSize = '100%';
// el.style.backgroundRepeat = 'no-repeat';


// const marker1 = new mapboxgl.Marker({color:'red'})
//   .setLngLat(listing.geometry.coordinates)
//   .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
//   .addTo(map);

let isClicked = false;
let clickPopup = null;

// Hover popup
const hoverPopup = new mapboxgl.Popup({
  offset: 25,
  closeButton: false,
  closeOnClick: false
}).setHTML(`
  <h4>${listing.title}</h4>
  <p>Exact location will be provided after booking</p>
`);

const marker1 = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

// Hover IN
marker1.getElement().addEventListener('mouseenter', () => {
  if (!isClicked) {
    hoverPopup.setLngLat(listing.geometry.coordinates).addTo(map);
  }
});

// Hover OUT
marker1.getElement().addEventListener('mouseleave', () => {
  if (!isClicked) {
    hoverPopup.remove();
  }
});

// CLICK popup
marker1.getElement().addEventListener('click', (e) => {
  e.stopPropagation(); // IMPORTANT

  isClicked = true;
  hoverPopup.remove();

  if (clickPopup) clickPopup.remove();

  clickPopup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: true
  })
    .setLngLat(listing.geometry.coordinates)
    .setHTML(`
      <h4>${listing.title}</h4>
      <p>Exact location will be provided after booking</p>
    `)
    .addTo(map);

  clickPopup.on('close', () => {
    isClicked = false;
  });
});
