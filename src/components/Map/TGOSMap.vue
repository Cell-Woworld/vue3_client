<template>
  <div id="map" key="map" ref="map"
    :style="elem.style"
  >
    <!-- v-on:click="handleClick($event)" -->
    <Section_L3 
      id="internal_use"
      ref="internal_use"
      :elem="elem"
      style="width:0px;height:0px;"
    />
  </div>
</template>

<script>
var defaultMethods = {
  handleClick: function (event) {
    this.$refs.internal_use.handleClick(event);
  },
  handleChanged: function (event) {
    this.$refs.internal_use.handleChanged(event);
  },
  initMap() {
    this.instance = new window.TGOS.TGOnlineMap(this.$refs.map, window.TGOS.TGCoordSys.EPSG3857, {
      scaleControl: this.scaleControl,            //比例尺
      navigationControl: this.zoomControl,        //地圖縮放控制項
      navigationControlOptions: {                 //設定地圖縮放控制項
        controlPosition: window.TGOS.TGControlPosition.RIGHT_BOTTOM,  //控制項位置
        navigationControlStyle: window.TGOS.TGNavigationControlStyle.SMALL         //控制項樣式
      },
      mapTypeControl: this.mapTypeControl,        //地圖類型控制項
      scrollwheel: !this.elem.map || !this.elem.map.noScrollwheel,        //scrollwheel(是否允許使用者對地圖物件使用滑鼠滾輪),
      draggable: !this.elem.map || !this.elem.map.notDraggable,           //draggable(設定地圖是否可被拖曳)
      dbClickZoomIn: !this.elem.map || !this.elem.map.noDbClickZoomIn,    //draggable(設定地圖是否可被拖曳)
    });
    this.instance.setZoom(this.zoom);                   //初始地圖縮放層級
    this.resetCenter();                                 //初始地圖中心點
    this.setMarker();
    this.instance.setMapTypeId(window.TGOS.TGMapTypeId.NLSCMAP);
    let _this = this;
    window.TGOS.TGEvent.addListener(this.instance, "click", function (/*e*/) {  //加入滑鼠單擊地圖事件監聽器
      // _this.handleClick(e);
    });
    window.TGOS.TGEvent.addListener(this.instance,"zoom_changed", function () {
      _this.handleChanged(_this); 
    });
    window.TGOS.TGEvent.addListener(this.instance,"dragend", function () {
      let _ui_event = {
        id: _this.elem.id,
        content: JSON.stringify({ event:'center', lng: _this.instance.getCenter().x, lat: _this.instance.getCenter().y }),
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    });
  },
  resetCenter() {
    // set center
    this.instance.setCenter(new window.TGOS.TGPoint(this.center.lng,this.center.lat));
  },
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.labels.forEach(label => label.setMap(null));
    this.labels = [];
  },
  setMarker() {
    const invertColor = (bg) => {
      bg=parseInt(Number(bg.replace('#', '0x')), 10)
      bg=~bg
      bg=bg>>>0
      bg=bg&0x00ffffff
      bg='#' + bg.toString(16).padStart(6, "0")
      
      return bg
    }
    // clear existing markers
    this.clearMarkers();
    this.locations.forEach((location,index) => {
      let markPoint = new window.TGOS.TGPoint(location.lng,location.lat);
      let marker = null;
      let label = null;
      const markerTypeEnum = window.WsClient.proto_root_.lookupEnum('MarkerType');
      if (this.elem.map && this.elem.map.markers) {
        switch (this.elem.map.markers[index].type) {
          case markerTypeEnum.values.IMAGE: {
            marker = new window.TGOS.TGMarker(
              this.instance,
              markPoint,
              '',
              new window.TGOS.TGImage(this.elem.map.markers[index].content, new window.TGOS.TGSize(38, 33), new window.TGOS.TGPoint(0, 0), new window.TGOS.TGPoint(10, 33)),
            );
            this.markers.push(marker);
            break;
          }
          default: {
            let pTGSymbo = new window.TGOS.TGSymbol();
            pTGSymbo.xPixel = 64;                     //設定標記寬度
            pTGSymbo.yPixel = 64;                     //設定標記高度
            pTGSymbo.fillColor = this.elem.map.markers[index].color?this.elem.map.markers[index].color:"#F1913D";            //設定填入顏色
            pTGSymbo.fillOpacity = 0.7;               //設定透明度
            pTGSymbo.strokeWeight = 10;               //設定框線寬度
            pTGSymbo.strokeOpacity = 0.5;             //設定框線透明度
            pTGSymbo.strokeColor = "#ffffff";         //設定框線顏色
            pTGSymbo.anchor.x = 32;                   //設定錨點x座標
            pTGSymbo.anchor.y = 32;                   //設定錨點y座標
            pTGSymbo.rotation = 0;                    //設定符號旋轉方向
            switch (this.elem.map.markers[index].type) {
              case markerTypeEnum.values.FORWARD_CLOSED_ARROW:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.FORWARD_CLOSED_ARROW;
                break;
              case markerTypeEnum.values.FORWARD_OPEN_ARROW:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.FORWARD_OPEN_ARROW;
                break;
              case markerTypeEnum.values.BACKWARD_CLOSED_ARROW:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.BACKWARD_CLOSED_ARROW;
                break;
              case markerTypeEnum.values.BACKWARD_OPEN_ARROW:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.BACKWARD_OPEN_ARROW;
                break;
              case markerTypeEnum.values.CIRCLE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.CIRCLE;
                break;
              case markerTypeEnum.values.DOUBLE_CIRCLE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.DOUBLE_CIRCLE;
                break;
              case markerTypeEnum.values.TRIPLE_CIRCLE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.TRIPLE_CIRCLE;
                break;
              case markerTypeEnum.values.CIRCLE_SPOT:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.CIRCLE_SPOT;
                break;
              case markerTypeEnum.values.TRIANGLE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.TRIANGLE;
                break;
              case markerTypeEnum.values.INVERT_TRIANGLE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.INVERT_TRIANGLE;
                break;
              case markerTypeEnum.values.SQUARE:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.SQUARE;
                break;
              case markerTypeEnum.values.PENTAGON:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.PENTAGON;
                break;
              case markerTypeEnum.values.HEXAGON:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.HEXAGON;
                break;
              case markerTypeEnum.values.OCTAGON:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.OCTAGON;
                break;
              case markerTypeEnum.values.PENTASTAR:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.PENTASTAR;
                break;
              case markerTypeEnum.values.HEXASTAR:
                pTGSymbo.symbolStyle = window.TGOS.TGSymbolStyle.HEXASTAR;
                break;
              default:
                break;
            }
            marker = new window.TGOS.TGMarker(this.instance, markPoint,'',pTGSymbo); //用幾何圖形建立標記點
            marker.setFlat(true);              //設定標記陰影不出現
            this.markers.push(marker);

            let labelPt = new window.TGOS.TGPoint(markPoint.x,markPoint.y); 
            let labelOpts = {
              map: this.instance,
              fontColor: this.elem.map.markers[index].color?invertColor(this.elem.map.markers[index].color):"#ffffff",    //字型顏色
              fontSize: 14,           //字體大小
              font: "Arial",          //字型
              fontWeight: "bold",     //字體粗細
              opacity: 1.0,           //透明度
              position: labelPt,    //註記位置
              label: this.elem.map.markers[index].content
            };
            label = new window.TGOS.TGLabel(labelOpts);
            this.labels.push(label);

            break;
          }
        }
      }
      let infoWindowWidth = Math.round(this.$el.clientWidth / 3);
      let infoWindowHeight = Math.round(this.$el.clientHeight / 4);
      if (location.name) {
        this.infowindow = new window.TGOS.TGInfoWindow(
          `<div id="content" style="max-height:${infoWindowHeight}px;overflow:hidden auto;">
            <p id="firstHeading" class="firstHeading">${location.name}</p>
          </div>`,
          markPoint,
          {
            maxWidth: infoWindowWidth,                    //訊息視窗的最大寬度
            pixelOffset: new window.TGOS.TGSize(5, -30),  //InfoWindow起始位置的偏移量, 使用TGSize設定, 向右X為正, 向上Y為負 
            zIndex:99,                                    //視窗堆疊順序
            disableAutoPan: false,
            opacity: 0.7,
          }
        )
      }
      let _self = this;
      window.TGOS.TGEvent.addListener(label, "mousedown", (e) => {
        // window.console.log(label.position.x, label.position.y);
        // _self.handleClick(e);
        // let _ui_event =
        // {
        //   id: _self.elem.id,
        //   content: JSON.stringify({lng:label.position.x, lat:label.position.y}),
        // };
        // window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
      });
      window.TGOS.TGEvent.addListener(marker, "mousedown", (e) => {
        // window.console.log(marker.position.x, marker.position.y);
        // _self.handleClick(e);
        // let _ui_event =
        // {
        //   id: _self.elem.id,
        //   content: JSON.stringify({lng:marker.position.x, lat:marker.position.y}),
        // };
        // window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
      });
      window.TGOS.TGEvent.addListener(marker, "mouseover", () => {
        if (_self.infowindow != null) {
          _self.infowindow.open(_self.instance);
        }
      });
      window.TGOS.TGEvent.addListener(marker, "mouseout", () => {
        if (_self.infowindow != null) {
          _self.infowindow.close();
        }
      });
      window.TGOS.TGEvent.addListener(label, "click", (e) => {
        _self.handleClick(e);
      });
      window.TGOS.TGEvent.addListener(marker, "click", (e) => {
        _self.handleClick(e);
      });
    }, this);
  },
  clearAll() {
    if (this.LocMarker) 
    {
      this.LocMarker.setMap(null);  //假設地圖上已存在查詢後得到的地址標記點, 則先行移除
      this.LocMarker = null;
    }
    this.clearMarkers();
  },
  addMarkerClusters() {     //使用群聚標記點功能
    let mCluster = new window.TGOS.TGMarkerCluster(this.$refs.map, this.markers,{}); //建立群聚標記點物件
    mCluster.setMaxZoom(10);          //設定群聚標記點最大縮放範圍          
    mCluster.setVisible(true);        //設定群聚標記點是否為顯示狀態
    mCluster.setSearchBounds(30);     //設定群聚標記點的搜尋範圍(單位px)
    mCluster.redrawAll(true);         //是否重新繪製群聚標記點物件
    this.mClusters.push(mCluster);
  },
  clearMarkerClusters() {     //移除群聚標記點中的標記點陣列
    if (this.mClusters.length > 0) {
      for (var i = 0; i < this.mClusters.length; i++) {
        this.mClusters[i].removeMarkers(this.markers, true);  //清除所有
      }
    }
  },
  addWms(url){
    var WMS = new window.TGOS.TGWmsLayer(
      url, //'https://ogcmap.tgos.tw/TGOS_UserServices/3377/VillageWGS84/SimpleWMS.aspx?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=Village_NLSC_84&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:4326&BBOX=116.774712009804,21.9,125.925287990196,26.39&WIDTH=1663&HEIGHT=816'
      {
      //建立WMS物件, 加入WMS連結, 並指定相關屬性
        map: this.instance,
        preserveViewport: true,
        //zIndex: 1,
        wsVisible: true,
        opacity: 0.5,
    });
    this.WMSLayer.push(WMS);
  },
  deleteWms(){
    if (this.WMSLayer.length > 0) {
      for(var i = 0; i < this.WMSLayer.length; i++)
      {
        this.WMSLayer[i].removeWmsLayer();  //當圖面上存在WMS圖層時, 將該圖層移除
      }
      this.WMSLayer = [];
    } else {
      //window.alert('圖面上不存在WMS圖層');
    }
  },
  addKml(url) {
    let _this = this;
    var Kml = new window.TGOS.TGKmlLayer(url, {
      //加入KML圖層到地圖
      map: this.instance,
      suppressInfoWindows: false,
      preserveViewport: false
    }, function() {
      var meta = Kml.getMetadata();
      window.console.log(meta.name);
      _this.KmlLayer.push({'url':url,'instance':Kml});
      _this.setMarker();
    });
  },
  deleteKml(){
    if (this.KmlLayer.length > 0) {
      for(var i = 0; i < this.KmlLayer.length; i++)
      {
        this.KmlLayer[i].instance.removeKml();  //當圖面上存在KML圖層時, 將該圖層移除
      }
      this.KmlLayer = [];
    } else {
      //window.alert('圖面上不存在KML圖層');
    }
  },
}
import Section_L3 from "@/components/Section/Section_L3.vue";
export default {
  name: "TGOSMap",
  components: {
    Section_L3,
  },
  // 接收來自父元件的地圖設定資訊
  props: {
    elem: Object,
    center: {
      type: Object,
      default: () => ({ lng: 120.982024, lat: 23.973875 })
    },
    zoom: {
      type: Number,
      default: 8
    },
    scaleControl: {
      type: Boolean,
      default: false
    },
    mapTypeControl: {
      type: Boolean,
      default: false
    },
    fullscreenControl: {
      type: Boolean,
      default: true
    },
    zoomControl: {
      type: Boolean,
      default: false
    },
    keyboardShortcuts: {   //keyboardShortcuts(設定是否可用鍵盤控制地圖)
      type: Boolean,
      default: false
    },
    locations: {
      type: Array,
      default: () => [
        { lng: 120.982024, lat: 23.973875, name:'<B>台北車站</B><br>台北市北平西路3號' }
      ]
    }
  },
  data() {
    return {
      instance: null,
      infowindow: null,
      markers: [],
      labels: [],
      mClusters: [],
      markImage: [
        new window.TGOS.TGImage('http://api.tgos.tw/TGOS_API/images/marker.png', new window.TGOS.TGSize(38, 33), new window.TGOS.TGPoint(0, 0), new window.TGOS.TGPoint(10, 33)),
        new window.TGOS.TGImage('http://api.tgos.tw/TGOS_API/images/marker1.png', new window.TGOS.TGSize(38, 33), new window.TGOS.TGPoint(0, 0), new window.TGOS.TGPoint(10, 33)),
        new window.TGOS.TGImage('http://api.tgos.tw/TGOS_API/images/marker2.png', new window.TGOS.TGSize(38, 33), new window.TGOS.TGPoint(0, 0), new window.TGOS.TGPoint(10, 33)),
      ],
      WMSLayer: [], //宣告一個空的變數, 準備承接WMS物件使用
      KmlLayer: [], //宣告一個空的變數, 準備承接KML物件使用
    };
  },
  // 當發現中心位置改變時，更新中心位置與地標
  watch: {
    center() {
      this.resetCenter();
      this.setMarker();
      let _the_same = true;
      this.KmlLayer.every((element, index) => {
        if (this.elem.map.layers[index] != element.url) {
          _the_same = false;
          return false;
        }
        return true;
      },this);
      if (this.KmlLayer.length==0 && this.elem.map.layers.length > 0 || !_the_same) {
        this.deleteKml();
        this.elem.map.layers.forEach(element => {
          this.addKml(element);
        }, this);
      }
    },
    zoom() {
      // window.console.log('zoom index=', this.zoom);
    }
  },
  mounted() {
    this.initMap();
    this.setMarker();
    if (this.KmlLayer.length==0 && this.elem.map.layers.length > 0) {
      this.deleteKml();
      this.elem.map.layers.forEach(element => {
        this.addKml(element);
      }, this);
    }
  },
  methods: defaultMethods
};
</script>