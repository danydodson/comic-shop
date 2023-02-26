document.addEventListener("DOMContentLoaded", () => {
    console.log("Mapbox JS file imported successfully!");
  
    // Select the elements that store the info about the display of the map
    const mapCenter = document.querySelector(".map-center").innerHTML.split(",")
    const mapZoom = document.querySelector(".map-zoom").innerHTML
  
    // Select the elements that store the info about the locatinos and markers
    const posDiv = document.querySelector(".pos")
    const markerDiv = document.querySelector(".marker")
  
    // Create an array to store all the popups (one for each location)
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybGVzcHVuYSIsImEiOiJjbGExNTNhMmIwNGJnM3Ftbzdjb21rbTR3In0.w6aVfjk2ZJCyzRVl1-cCGA';
  
    // Generating the map
    const map = new mapboxgl.Map({
      container: 'map',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: "mapbox://styles/mapbox/streets-v11",
      center: mapCenter,
      zoom: (mapZoom)
    });

  
    // Create a marker for every position
    const posS = posDiv.innerText.split(",")
    new mapboxgl.Marker(markerDiv)
      .setLngLat(posS)
      .addTo(map)
  });
  