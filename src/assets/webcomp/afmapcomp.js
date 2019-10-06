"use strict";

{
    let initCalled;
    const MAX_ZOOM = 15;
    const AMSTERDAM = {
        lat: 52.37,
        lng: 4.895
    };
    var icon =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAF96VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAABo3uNKT81LLcpMVigoyk/LzEnlUgADYxMuE0sTS6NEAwMDCwMIMDQwMDYEkkZAtjlUKNEABZgamFmaGZsZmgMxiM8FAEi2FMnxHlGkAAADqElEQVRo3t1aTWgTQRQOiuDPQfHs38GDogc1BwVtQxM9xIMexIN4EWw9iAehuQdq0zb+IYhglFovClXQU+uhIuqh3hQll3iwpyjG38Zkt5uffc4XnHaSbpLZ3dnEZOBB2H3z3jeZN+9vx+fzYPgTtCoQpdVHrtA6EH7jme+/HFFawQBu6BnWNwdGjB2BWH5P32jeb0V4B54KL5uDuW3D7Y/S2uCwvrUR4GaEuZABWS0FHhhd2O4UdN3FMJneLoRtN7Y+GMvvUw2eE2RDh3LTOnCd1vQN5XZ5BXwZMV3QqQT84TFa3zuU39sy8P8IOqHb3T8fpY1emoyMSQGDI/Bwc+0ELy6i4nLtepp2mE0jc5L3UAhMsdxut0rPJfRDN2eMY1enF8Inbmj7XbtZhunkI1rZFD/cmFMlr1PFi1/nzSdGkT5RzcAzvAOPU/kVF9s0ujqw+9mP5QgDmCbJAV7McXIeGpqS3Qg7OVs4lTfMD1Yg9QLR518mZbImFcvWC8FcyLAbsev++3YETb0tn2XAvouAvjGwd14YdCahUTCWW6QQIzzDO/CIAzKm3pf77ei23AUkVbICHr8pnDZNynMQJfYPT7wyKBzPVQG3IvCAtyTsCmRBprQpMawWnkc+q2Rbn+TK/+gmRR7qTYHXEuZkdVM0p6SdLLYqX0LItnFgBxe3v0R04b5mGzwnzIUMPiBbFkdVmhGIa5tkJ4reZvyl4Rg8p3tMBh+FEqUduVRUSTKTnieL58UDG76cc70AyMgIBxs6pMyIYV5agKT9f/ltTnJFOIhuwXOCLD6gQ/oc8AJcdtuYb09xRQN3NWULgCwhfqSk3SkaBZViRTK3EYNUSBF4Hic0Y8mM+if0HhlMlaIHbQ8Z5lszxnGuIP2zrAw8J8jkA7pkMAG79AKuPTOOcgWZeVP5AsSDjAxWegGyJoSUWAj/FBpRa0JiviSbfldMqOMPcce7UVeBLK4gkMVVBLI2phLjKlIJm8lcxMNkLuIomXOTTmc1kwYf2E+nMQdzlaTTKgoaZJWyBQ141RY0DkrK6XflAQbih1geZnhJeXu5WeEZ3mVqSkrIgCzXJaXqoh65TUuLerdtFXgQ2bYKeD1pq6hobLE86SlztXMWvaA5vPO0sYWB9p2K1iJS4ra0Fju/udsN7fWu+MDRFZ+YuuIjX1d8Zu2OD92WC9G3ub1qABktBV7vssfBMX1L7yVjZ7PLHuABb9svezS7boNDyK/b4LdX123+Au+jOmNxrkG0AAAAAElFTkSuQmCC";
    var mIcon = {
        url: icon,
        scaledSize: {
            width: 30,
            height: 30
        }
    };
    const callbackPromise = new Promise(r => (window.__initGoodMap = r));

    function loadGoogleMaps(apiKey) {
        if (!initCalled) {
            const script = document.createElement("script");
            script.src =
                "https://maps.googleapis.com/maps/api/js?" +
                (apiKey ? `key=${apiKey}&` : "") +
                "callback=__initGoodMap";
            document.head.appendChild(script);
            initCalled = true;
        }
        return callbackPromise;
    }

    customElements.define(
        "af-map",
        class extends HTMLElement {
            constructor() {
                super();

                this.map = null;
                this.apiKey = null;
                this.zoom = null;
                this.latitude = null;
                this.longitude = null;
                this.mapOptions = {
                    center: AMSTERDAM,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false
                };
                this.location = null; // where the user is
                this.locationMarker = {};
                this.markers = {}; // qname => google.map.Marker

                var shadowRoot = this.attachShadow({ mode: "open" });
                shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        border: 1px dotted black;
                    }
                    #map {
                        width: 100%;
                        height: 100%;                        
                    }
                </style>
                <div id='map'></div>`;
            }

            connectedCallback() {
                loadGoogleMaps(this.apiKey).then(() => {
                    // console.log("map loaded");
                    this.mapOptions.zoom = this.zoom || 12;

                    this.mapOptions.center = {
                        lat: this.latitude || AMSTERDAM.latitude,
                        lng: this.longitude || AMSTERDAM.longitude
                    };

                    this.map = new google.maps.Map(
                        this.shadowRoot.querySelector("#map"),
                        this.mapOptions
                    );

                    const kids = Array.from(this.childNodes);
                    console.log(kids);
                    kids.filter(node => node.localName == "af-marker").forEach(
                        (node, idx) => {
                            const marker = new google.maps.Marker({
                                position: {
                                    lat: node.latitude,
                                    lng: node.longitude
                                },
                                label: "gello",
                                icon: pinSymbol("#00ee00"),
                                zIndex: 100 - idx
                            });
                            marker.setMap(this.map);
                        }
                    );

                    google.maps.event.addListenerOnce(this.map, "idle", () => {
                        this.attachMarkers();
                        this.addLocation();
                    });

                    this.map.addListener("dragend", () => {
                        let detail = this.map.getBounds().toJSON();
                        let resp = Object.assign(detail, {
                            zoom: this.map.getZoom()
                        });
                        this.dispatchEvent(
                            new CustomEvent("bounds-changed", { detail: resp })
                        );
                    });
                });
            }

            static get observedAttributes() {
                return [
                    "api-key",
                    "zoom",
                    "latitude",
                    "longitude",
                    "my-location",
                    "map-options",
                    "restos"
                ];
            }

            attributeChangedCallback(name, oldVal, val) {
                // console.log("attributeChangedCallback", name, val)
                switch (name) {
                    case "api-key":
                        this.apiKey = val;
                        break;
                    case "zoom":
                    case "latitude":
                    case "longitude":
                        this[name] = parseFloat(val);
                        break;
                    case "my-location":
                        this.location = JSON.parse(val);
                        this.addLocation();
                        break;
                    case "map-options":
                        this.mapOptions = JSON.parse(val);
                        break;
                    case "restos":
                        this.attachMarkers();
                        break;
                }
            }

            addLocation() {
                // re-use marker
                if (typeof google != "undefined" && google.maps) {
                    if (this.location) {
                        this.locationMarker = new google.maps.Marker({
                            position: this.location,
                            icon: mIcon,
                            zIndex: 100
                        });
                        this.locationMarker.setMap(this.map);
                    } else if (
                        this.locationMarker &&
                        this.locationMarker.setMap
                    ) {
                        // location no longer in Amsterdam
                        this.locationMarker.setMap(null);
                    }
                }
            }

            attachMarkers() {
                try {
                    let restos = JSON.parse(this.getAttribute("restos")) || {};
                    // console.log("attachmarkers", restos);
                    if (typeof google != "undefined" && google.maps) {
                        this.addRemoveMarkers(restos);
                    }
                } catch (e) {}
            }

            addRemoveMarkers(restos) {
                if (restos.remove) {
                    restos.remove.forEach(qname => {
                        if (this.markers[qname]) {
                            this.markers[qname].setMap(null);
                            delete this.markers[qname];
                        }
                    });
                }

                if (restos.draw) {
                    restos.draw.forEach((r, idx) => {
                        if (this.map) {
                            let existingMarker = this.markers[r.qname];
                            if (existingMarker) {
                                existingMarker.setIcon(pinSymbol(r.colour));
                                existingMarker.setLabel(r.label);
                            } else {
                                const newMarker = this.makeMarker(r, idx);
                                newMarker.setMap(this.map);
                                this.markers[r.qname] = newMarker;
                            }
                        }
                    });
                }

                this.fitMap();
            }

            makeMarker(r, idx) {
                const pos = new google.maps.LatLng(r.lat, r.lng);

                const marker = new google.maps.Marker({
                    position: pos,
                    label: r.label,
                    icon: pinSymbol(r.colour),
                    zIndex: 100 - idx
                });

                google.maps.event.addListener(
                    marker,
                    "click",
                    (qname => {
                        this.dispatchEvent(
                            new CustomEvent("marker-clicked", {
                                detail: qname
                            })
                        );
                    }).bind(this, r.qname)
                );
                marker.qname = r.qname;

                marker.setZIndex(100 - idx);
                return marker;
            }

            fitMap() {
                let markers = Object.values(this.markers);
                // if there are no markers (and no location) we end up at 0,0
                if (markers.length) {
                    const mybounds = new google.maps.LatLngBounds();
                    if (this.location) {
                        mybounds.extend(
                            new google.maps.LatLng(
                                this.location.lat,
                                this.location.lng
                            )
                        );
                    }

                    markers
                        .filter(m => m.getMap())
                        .forEach(marker =>
                            mybounds.extend(marker.getPosition())
                        );

                    this.map.fitBounds(mybounds);

                    if (this.map.getZoom() > MAX_ZOOM) {
                        this.map.setZoom(MAX_ZOOM);
                    }
                }
            }
        }
    );
}

function makeCircleObj(pt, colour, zoom) {
    return {
        strokeColor: "#000099",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colour,
        fillOpacity: 0.35,
        center: pt,
        radius: getRadius(zoom),
        zIndex: 100
    };
}

function getRadius(zoom) {
    switch (zoom) {
        case 21:
            return 2;
        case 20:
            return 3;
        case 19:
            return 5;
        case 18:
            return 6;
        case 17:
            return 10;
        case 16:
            return 15;
        case 15:
            return 30;
        case 14:
            return 60;
        case 13:
            return 100;
        case 12:
            return 160;
        case 11:
            return 210;
        case 10:
            return 300;
    }
}

function pinSymbol(color) {
    return {
        path:
            "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#000",
        strokeWeight: 1,
        scale: 1,
        labelOrigin: new google.maps.Point(0, -29)
    };
}
