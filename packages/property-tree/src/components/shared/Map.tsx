import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapProps {
  location: {
    name: string
    coordinates: [number, number]
  }
}

export function Map({ location }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const MAPTILER_KEY = 'PG6pJ2mVQ5TkHGTIkrfq'
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
      center: location.coordinates,
      zoom: 16,
      pitch: 45,
      bearing: -17.6,
      maxZoom: 19,
      minZoom: 14,
      canvasContextAttributes: { antialias: true }
    })

    map.current.on('load', () => {
      if (!map.current) return

      // Find label layer to place buildings under it
      const layers = map.current.getStyle().layers
      let labelLayerId
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout && 'text-field' in layers[i].layout) {
          labelLayerId = layers[i].id
          break
        }
      }

      // Add OpenMapTiles source
      map.current.addSource('openmaptiles', {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
        type: 'vector',
      })

      // Add 3D building layer
      map.current.addLayer(
        {
          'id': '3d-buildings',
          'source': 'openmaptiles',
          'source-layer': 'building',
          'type': 'fill-extrusion',
          'minzoom': 15,
          'filter': ['!=', ['get', 'hide_3d'], true],
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0, 'lightgray',
              200, 'royalblue',
              400, 'lightblue'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              16,
              ['get', 'render_height']
            ],
            'fill-extrusion-base': [
              'case',
              ['>=', ['get', 'zoom'], 16],
              ['get', 'render_min_height'],
              0
            ]
          }
        },
        labelLayerId
      )
    })

    // Add marker and popup
    new maplibregl.Marker()
      .setLngLat(location.coordinates)
      .setPopup(new maplibregl.Popup().setHTML(`<h3>${location.name}</h3>`))
      .addTo(map.current)

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
    }
  }, [location])

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
