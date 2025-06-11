<template>
  <div :style="elem.style" id="map" ref="map"></div>
</template>

<script>
export default {
  // 接收來自父元件的地圖設定資訊
  props: {
    elem: Object,
    center: {
      type: Object,
      default: () => ({ lat: 25.033606, lng: 121.565150 })
    },
    zoom: {
      type: Number,
      default: 14
    },
    streetViewControl: {
      type: Boolean,
      default: true
    },
    mapTypeControl: {
      type: Boolean,
      default: true
    },
    fullscreenControl: {
      type: Boolean,
      default: true
    },
    zoomControl: {
      type: Boolean,
      default: true
    },
    locations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      instance: null,
      infowindow: null,
      markers: []
    };
  },
  // 當發現中心位置改變時，更新中心位置與地標
  watch: {
    center(/*val*/) {
      this.resetCenter();
      this.setMarker();
    }
  },
  mounted() {
    this.initMap();
    this.setMarker();
  },
  methods: {
    initMap() {
      //this.instance = new window.google.maps.Map(window.document.getElementById("map"), {
      this.instance = new window.google.maps.Map(this.$refs.map, {
        center: this.center,
        zoom: this.zoom,
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: this.streetViewControl,
        mapTypeControl: this.mapTypeControl,
        fullscreenControl: this.fullscreenControl,
        zoomControl: this.zoomControl
      });
    },
    resetCenter() {
      // set center
      this.instance.panTo({ lat: this.center.lat, lng: this.center.lng });
    },
    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    },
    setMarker() {
      // clear existing markers
      this.clearMarkers();
      this.locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: this.instance
        });
        // save markers
        this.markers.push(marker);
        const infowindow = new window.google.maps.InfoWindow({
          content: `
          <div id="content">
            <p id="firstHeading" class="firstHeading">${location.name}</p>
          </div>
        `,
          maxWidth: 200
        });
        marker.addListener("click", () => {
          if (this.infowindow) this.infowindow.close();
          infowindow.open(this.instance, marker);
          this.infowindow = infowindow;
        });
      });
    }
  }
};
</script>